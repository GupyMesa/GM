// server.js
const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('.'));

const bq = new BigQuery({
    keyFilename: path.join(__dirname, 'credentials.json'),
    projectId: 'gupymesa-487420',
    location: 'southamerica-east1'
});

// Login
app.post('/api/login', async (req, res) => {
    const { id, senha } = req.body;
    try {
        const query = `
            SELECT id, nome, cargo 
            FROM \`gupymesa-487420.sistema_mesa.usuarios\` 
            WHERE id = @id AND senha = @senha 
            LIMIT 1`;
        
        const [rows] = await bq.query({ 
            query, 
            params: { id: parseInt(id), senha: senha } 
        });

        if (rows.length > 0) {
            res.json({ sucesso: true, usuario: rows[0] });
        } else {
            res.status(401).json({ sucesso: false, mensagem: 'ID ou Senha incorretos' });
        }
    } catch (error) {
        console.error('Erro Login:', error.message);
        res.status(500).json({ sucesso: false, mensagem: error.message });
    }
});

// Listar Usuários
app.get('/api/usuarios', async (req, res) => {
    try {
        const query = `SELECT id, nome, cargo FROM \`gupymesa-487420.sistema_mesa.usuarios\` LIMIT 1000`;
        const [rows] = await bq.query({ query });
        res.json(rows);
    } catch (error) {
        console.error('Erro Usuários:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Listar Empresas (Preparo para o futuro)
app.get('/api/empresas', async (req, res) => {
    try {
        // Verifica se a tabela existe antes de consultar
        const query = `SELECT * FROM \`gupymesa-487420.sistema_mesa.empresas\` LIMIT 1000`;
        const [rows] = await bq.query({ query });
        res.json(rows);
    } catch (error) {
        // Se a tabela não existir, retorna array vazio sem erro
        res.json([]); 
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('🚀 GupyMesa rodando na porta ' + PORT));