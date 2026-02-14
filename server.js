const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');
const app = express();

const bigquery = new BigQuery({
  projectId: 'gupymesa-487420',
  keyFilename: './credentials.json',
  location: 'southamerica-east1'
});

app.use(express.json());
// Isso faz o servidor ler o index.html e as pastas src/assets da raiz
app.use(express.static('.')); 

app.post('/api/login', async (req, res) => {
    const { id, senha } = req.body;
    console.log(`🔑 Tentativa de login ID: ${id}`);

    try {
        const query = `
            SELECT nome, cargo, senha 
            FROM \`gupymesa-487420.sistema_mesa.usuarios\`
            WHERE id = @id AND senha = @senha
            LIMIT 1
        `;
        
        const options = { query, params: { id: String(id), senha: String(senha) } };
        const [rows] = await bigquery.query(options);

        if (rows.length > 0) {
            res.json({ sucesso: true, usuario: rows[0] });
        } else {
            res.json({ sucesso: false, mensagem: 'ID ou Senha incorretos.' });
        }
    } catch (erro) {
        console.error('Erro:', erro);
        res.status(500).json({ sucesso: false, mensagem: 'Erro no banco de dados.' });
    }
});

app.listen(3000, () => console.log('🚀 GupyMesa rodando na porta 3000'));