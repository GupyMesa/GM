const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');

async function ver() {
    try {
        const bq = new BigQuery({
            keyFilename: path.join(__dirname, 'credentials.json'),
            projectId: 'gupymesa-487420'
        });
        
        console.log("📂 Tabelas no dataset 'sistema_mesa':");
        const [tables] = await bq.dataset('sistema_mesa').getTables();
        tables.forEach(table => console.log(' - ' + table.id));
    } catch (err) {
        console.error("❌ Erro:", err.message);
    }
}
ver();
