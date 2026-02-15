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
app.use(express.static('.'));

app.post('/api/login', async (req, res) => {
    const { id, senha } = req.body;
    try {
        const query = `SELECT nome, cargo, senha FROM \`gupymesa-487420.sistema_mesa.usuarios\` WHERE id = @id AND senha = @senha LIMIT 1`;
        const options = { query, params: { id: String(id), senha: String(senha) } };
        const [rows] = await bigquery.query(options);
        if (rows.length > 0) {
            res.json({ sucesso: true, usuario: rows[0] });
        } else {
            res.json({ sucesso: false, mensagem: 'ID ou Senha incorretos.' });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ sucesso: false, mensagem: 'Erro no banco.' });
    }
});

// AQUI ESTÁ A MUDANÇA: Usamos process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
