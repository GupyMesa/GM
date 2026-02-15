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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('🚀 GupyMesa rodando na porta ' + PORT));