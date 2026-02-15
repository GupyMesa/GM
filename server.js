const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('.'));

// Configuração do BigQuery para o Render
const bq = new BigQuery({
    keyFilename: path.join(__dirname, 'credentials.json'),
    projectId: 'gupymesa-487420'
});

// Rota de Login
app.post('/api/login', async (req, res) => {
    const { id, senha } = req.body;
    console.log('Tentativa de login ID:', id);

    try {
        const query = `
            SELECT id, nome, cargo, senha 
            FROM \`gupymesa-487420.gupymesa.usuarios\` 
            WHERE id = @id AND senha = @senha 
            LIMIT 1`;
        
        const options = {
            query: query,
            params: { id: parseInt(id), senha: senha }
        };

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
app.listen(PORT, () => {
    console.log('Servidor rodando na porta ' + PORT);
});
