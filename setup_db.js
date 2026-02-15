cat <<'EOF' > setup_db.js
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
        console.log("🛠️ Reorganizando banco de dados (Modo Batch - Free Tier)...");
        
        // 1. Deleta a tabela antiga para resetar o esquema
        try { 
            await bq.dataset(datasetId).table(tableId).delete(); 
            console.log("🗑️ Tabela antiga removida.");
        } catch(e) {
            console.log("ℹ️ Tabela não existia, criando nova.");
        }

        // 2. Cria a tabela com as colunas corretas
        const [table] = await bq.dataset(datasetId).createTable(tableId, {
            schema: [
                { name: 'id', type: 'INTEGER' },
                { name: 'nome', type: 'STRING' },
                { name: 'cargo', type: 'STRING' },
                { name: 'senha', type: 'STRING' }
            ]
        });
        console.log("📋 Nova tabela 'usuarios' criada.");

        // 3. Prepara os dados no formato NDJSON (exigido para o Load Job)
        const usuarios = [{ id: 1, nome: 'Super Admin', cargo: 'Admin', senha: 'Admin123' }];
        
        if (fs.existsSync('Usuarios.csv')) {
            const csvContent = fs.readFileSync('Usuarios.csv', 'utf8');
            const rows = csvContent.split('\n').slice(1);
            
            rows.forEach(row => {
                const cols = row.split(',');
                if (cols.length >= 5) {
                    const idVal = parseInt(cols[0].trim());
                    if (!isNaN(idVal)) {
                        usuarios.push({
                            id: idVal,
                            nome: cols[1].trim(),
                            cargo: cols[4].trim(),
                            senha: 'gupy123'
                        });
                    }
                }
            });
        }

        // Converte o array para strings NDJSON (uma linha por objeto)
        const ndjsonPath = path.join(__dirname, 'temp_usuarios.json');
        const ndjsonData = usuarios.map(u => JSON.stringify(u)).join('\n');
        fs.writeFileSync(ndjsonPath, ndjsonData);

        // 4. Faz o carregamento via Load Job (Obrigatório para Free Tier)
        console.log(`📦 Carregando ${usuarios.length} usuários...`);
        await table.load(ndjsonPath, {
            sourceFormat: 'NEWLINE_DELIMITED_JSON',
            writeDisposition: 'WRITE_TRUNCATE'
        });

        console.log("✅ SUCESSO! Banco de dados sincronizado.");
        fs.unlinkSync(ndjsonPath); // Deleta arquivo temporário
    } catch (err) {
        console.error("❌ Erro no Setup:", err.message);
    }
}
setup();
EOF