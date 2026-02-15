// scripts/reset_db_completo.js
const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync'); // Vamos usar parse nativo ou manual para evitar dep

async function reset() {
    const bq = new BigQuery({
        keyFilename: path.join(__dirname, '../credentials.json'),
        projectId: 'gupymesa-487420'
    });

    const datasetId = 'sistema_mesa';
    const tableId = 'usuarios';

    try {
        console.log("🔥 INICIANDO LIMPEZA E REESTRUTURAÇÃO DO BANCO...");

        // 1. Deletar Tabela
        try {
            await bq.dataset(datasetId).table(tableId).delete();
            console.log("🗑️  Tabela antiga removida.");
        } catch (e) { console.log("ℹ️  Tabela não existia."); }

        // 2. Criar Tabela com Schema Completo
        const schema = [
            { name: 'id', type: 'INTEGER' },
            { name: 'nome', type: 'STRING' },
            { name: 'cargo', type: 'STRING' },
            { name: 'contrato', type: 'STRING' },
            { name: 'status', type: 'STRING' },
            { name: 'senha', type: 'STRING' }
        ];

        const [table] = await bq.dataset(datasetId).createTable(tableId, { schema });
        console.log("📋 Nova tabela criada com colunas: ID, Nome, Cargo, Contrato, Status, Senha.");

        // 3. Ler CSV Local e Preparar Dados
        const csvPath = path.join(__dirname, '../data/Usuarios.csv');
        if (fs.existsSync(csvPath)) {
            const content = fs.readFileSync(csvPath, 'utf8');
            const lines = content.split('\n');
            const usuarios = [];
            const idsProcessados = new Set(); // Para validar duplicados no próprio CSV

            // Pula cabeçalho (linha 0)
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                // CSV: ID ASSISTENTE,NOME ASSIST,CONTRATO,SITUAÇÃO,FUNÇÃO
                // Regex para tratar vírgulas dentro de aspas se houver, ou split simples
                const cols = line.split(','); 
                
                if (cols.length >= 5) {
                    const id = parseInt(cols[0].trim());
                    
                    // VALIDAÇÃO DE DUPLICIDADE (Pelo ID)
                    if (!isNaN(id) && !idsProcessados.has(id)) {
                        usuarios.push({
                            id: id,
                            nome: cols[1].trim(),
                            contrato: cols[2].trim(),
                            status: cols[3].trim(),
                            cargo: cols[4].trim(),
                            senha: 'gupy123' // Senha padrão
                        });
                        idsProcessados.add(id);
                    }
                }
            }

            // 4. Inserir Dados Limpos
            if (usuarios.length > 0) {
                // Cria arquivo temporário JSON para carga em lote (Free Tier friendly)
                const tempJson = path.join(__dirname, 'temp_load.json');
                const ndjson = usuarios.map(u => JSON.stringify(u)).join('\n');
                fs.writeFileSync(tempJson, ndjson);

                await table.load(tempJson, {
                    sourceFormat: 'NEWLINE_DELIMITED_JSON',
                    writeDisposition: 'WRITE_TRUNCATE'
                });
                
                fs.unlinkSync(tempJson);
                console.log(`✅ SUCESSO! ${usuarios.length} usuários importados (Duplicados removidos).`);
            }
        } else {
            console.log("⚠️  Arquivo data/Usuarios.csv não encontrado. Banco criado vazio.");
        }

    } catch (err) {
        console.error("❌ Erro:", err.message);
    }
}

reset();