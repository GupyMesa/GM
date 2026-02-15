const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('.'));

// Configuração Inteligente: Tenta usar Variável de Ambiente, se não tiver, usa o arquivo
const bqConfig = process.env.GOOGLE_CREDENTIALS 
    ? {
        projectId: process.env.GOOGLE_PROJECT_ID,
        credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS)
      }
    : {
        keyFilename: path.join(__dirname, 'credentials.json'),
        projectId: 'gupymesa-487420'
      };

const bq = new BigQuery(bqConfig);

app.post('/api/login', async (req, res) => {
    const { id, senha } = req.body;
    try {
        const query = `SELECT id, nome, cargo FROM \`gupymesa-487420.gupymesa.usuarios\` WHERE id = @id AND senha = @senha LIMIT 1`;
        const options = { query, params: { id: parseInt(id), senha: senha } };
        const [rows] = await bq.query(options);

        if (rows.length > 0) {
            res.json({ sucesso: true, usuario: rows[0] });
        } else {
            res.status(401).json({ sucesso: false, mensagem: 'ID ou Senha incorretos' });
        }
    } catch (error) {
        console.error('Erro no BigQuery:', error);
        res.status(500).json({ sucesso: false, mensagem: 'Erro interno no servidor' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Servidor rodando na porta ' + PORT));
