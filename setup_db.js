cat <<EOF > setup_db.js
const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

async function setup() {
    const bq = new BigQuery({
        keyFilename: path.join(__dirname, 'credentials.json'),
        projectId: 'gupymesa-487420'
    });

    const datasetId = 'sistema_mesa';
    const tableId = 'usuarios';

    try {
        console.log("🛠️  Iniciando reorganização do banco...");
        
        // 1. Tentar deletar a tabela antiga para limpar o esquema
        try { await bq.dataset(datasetId).table(tableId).delete(); } catch(e) {}

        // 2. Criar a tabela com o esquema correto
        await bq.dataset(datasetId).createTable(tableId, {
            schema: [
                { name: 'id', type: 'INTEGER' },
                { name: 'nome', type: 'STRING' },
                { name: 'cargo', type: 'STRING' },
                { name: 'senha', type: 'STRING' }
            ]
        });

        // 3. Processar Dados
        const usuarios = [{ id: 1, nome: 'Super Admin', cargo: 'Admin', senha: 'Admin123' }];
        
        const csvContent = fs.readFileSync('Usuarios.csv', 'utf8');
        const rows = csvContent.split('\n').slice(1);
        
        rows.forEach(row => {
            const cols = row.split(',');
            if (cols.length >= 5) {
                usuarios.push({
                    id: parseInt(cols[0].trim()),
                    nome: cols[1].trim(),
                    cargo: cols[4].trim(), // FUNÇÃO
                    senha: 'gupy123'
                });
            }
        });

        // 4. Inserir no BigQuery
        await bq.dataset(datasetId).table(tableId).insert(usuarios);
        console.log(\`✅ Sucesso! \${usuarios.length} usuários inseridos com a nova lógica.\`);
    } catch (err) {
        console.error("❌ Erro:", err.message);
    }
}
setup();
EOF

# Execute agora para arrumar o banco
node setup_db.js