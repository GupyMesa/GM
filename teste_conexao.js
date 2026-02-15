const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');

async function testar() {
    try {
        const bq = new BigQuery({
            keyFilename: path.join(__dirname, 'credentials.json'),
            projectId: 'gupymesa-487420'
        });
        
        console.log("🔍 Tentando listar datasets...");
        const [datasets] = await bq.getDatasets();
        console.log("✅ Conexão OK! Datasets encontrados:");
        datasets.forEach(dataset => {
            console.log(`- ID: ${dataset.id} | Localização: ${dataset.metadata.location}`);
        });
    } catch (err) {
        console.error("❌ ERRO DE CONEXÃO:");
        console.error(err.message);
    }
}
testar();
