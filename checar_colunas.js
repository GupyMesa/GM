const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');

async function checar() {
    try {
        const bq = new BigQuery({
            keyFilename: path.join(__dirname, 'credentials.json'),
            projectId: 'gupymesa-487420'
        });
        
        console.log("🔍 Verificando as colunas da tabela 'usuarios'...");
        const [metadata] = await bq.dataset('sistema_mesa').table('usuarios').getMetadata();
        
        console.log("✅ Colunas encontradas:");
        metadata.schema.fields.forEach(campo => {
            console.log(`- ${campo.name} (${campo.type})`);
        });
    } catch (err) {
        console.error("❌ Erro ao ler colunas:", err.message);
    }
}
checar();
