const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('.'));

let bq;
try {
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
    bq = new BigQuery(bqConfig);
    console.log('🚀 BigQuery Iniciado');
} catch (e) {
    console.error('Falha na config:', e.message);
}

app.post('/api/login', async (req, res) => {
    const { id, senha } = req.body;
    try {
        const query = `SELECT id, nome, cargo FROM \`gupymesa-487420.gupymesa.usuarios\` WHERE id = @id AND senha = @senha LIMIT 1`;
        
        const [rows] = await bq.query({ 
            query, 
            location: 'southamerica-east1',
            params: { id: parseInt(id), senha: senha } 
        });

        if (rows.length > 0) {
            res.json({ sucesso: true, usuario: rows[0] });
        } else {
            res.status(401).json({ sucesso: false, mensagem: 'ID ou Senha incorretos' });
        }
    } catch (error) {
        console.error('ERRO NO SERVIDOR:', error);
        // O SEGREDO: Enviamos a mensagem real do erro para o seu navegador ver
        res.status(500).json({ sucesso: false, mensagem: 'Erro do Google: ' + error.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Servidor em 8080'));
