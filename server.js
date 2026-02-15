const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('.'));

const bqConfig = process.env.GOOGLE_CREDENTIALS 
    ? {
        projectId: 'gupymesa-487420',
        credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
        location: 'southamerica-east1'
      }
    : {
        keyFilename: path.join(__dirname, 'credentials.json'),
        projectId: 'gupymesa-487420',
        location: 'southamerica-east1'
      };

const bq = new BigQuery(bqConfig);

app.post('/api/login', async (req, res) => {
    const { id, senha } = req.body;
    try {
        // Usamos CAST para garantir que o ID funcione sendo String ou Inteiro no banco
        const query = `
            SELECT id, nome, cargo 
            FROM \`gupymesa-487420.sistema_mesa.usuarios\` 
            WHERE CAST(id AS STRING) = @id AND senha = @senha 
            LIMIT 1`;
        
        const options = { 
            query, 
            location: 'southamerica-east1',
            params: { id: id.toString(), senha: senha } 
        };
        const [rows] = await bq.query(options);

        if (rows.length > 0) {
            res.json({ sucesso: true, usuario: rows[0] });
        } else {
            res.status(401).json({ sucesso: false, mensagem: 'ID ou Senha incorretos' });
        }
    } catch (error) {
        console.error('🔥 ERRO NO SERVIDOR:', error.message);
        res.status(500).json({ sucesso: false, mensagem: error.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Servidor V13 pronto'));
