const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('.'));

// Configuração com Localização Forçada
let bq;
try {
    const bqConfig = process.env.GOOGLE_CREDENTIALS 
        ? {
            projectId: process.env.GOOGLE_PROJECT_ID,
            credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
            location: 'southamerica-east1' // <--- Força a busca em São Paulo
          }
        : {
            keyFilename: path.join(__dirname, 'credentials.json'),
            projectId: 'gupymesa-487420',
            location: 'southamerica-east1'
          };
    bq = new BigQuery(bqConfig);
    console.log('✅ BigQuery configurado para São Paulo.');
} catch (e) {
    console.error('❌ Erro na config:', e.message);
}

app.post('/api/login', async (req, res) => {
    const { id, senha } = req.body;
    try {
        const query = `
            SELECT id, nome, cargo 
            FROM \`gupymesa-487420.gupymesa.usuarios\` 
            WHERE id = @id AND senha = @senha 
            LIMIT 1`;

        const options = {
            query: query,
            location: 'southamerica-east1', // <--- Garante a localização na consulta
            params: { id: parseInt(id), senha: senha }
        };

        const [rows] = await bq.query(options);

        if (rows.length > 0) {
            res.json({ sucesso: true, usuario: rows[0] });
        } else {
            res.status(401).json({ sucesso: false, mensagem: 'ID ou Senha incorretos' });
        }
    } catch (error) {
        console.error('🔥 ERRO REAL:', error.message);
        res.status(500).json({ sucesso: false, mensagem: error.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Servidor rodando na porta ' + PORT));
