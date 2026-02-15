const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');

async function upload() {
    const bq = new BigQuery({
        keyFilename: path.join(__dirname, 'credentials.json'),
        projectId: 'gupymesa-487420'
    });

    // 1. Ler e Processar o CSV
    const csvData = fs.readFileSync('Usuarios.csv', 'utf8');
    const linhas = csvData.split('\n').slice(1); // Pula o cabeçalho
    
    const usuarios = [];

    // 2. Adicionar o Super Admin (ID 1)
    usuarios.push({
        id: 1,
        nome: 'Super Admin',
        cargo: 'Admin',
        senha: 'Admin123'
    });

    // 3. Adicionar usuários da planilha
    linhas.forEach(linha => {
        const colunas = linha.split(',');
        if (colunas.length >= 5) {
            const id = parseInt(colunas[0].trim());
            const nome = colunas[1].trim();
            const cargo = colunas[4].trim(); // FUNÇÃO
            
            if (!isNaN(id)) {
                usuarios.push({
                    id: id,
                    nome: nome,
                    cargo: cargo,
                    senha: 'gupy123'
                });
            }
        }
    });

    console.log(`📦 Preparados ${usuarios.length} usuários para upload...`);

    try {
        // 4. Configuração da Tabela (Isso vai sobrescrever a tabela com as colunas certas)
        const datasetId = 'sistema_mesa';
        const tableId = 'usuarios';
        
        // Deleta a tabela antiga para limpar o esquema errado
        try { await bq.dataset(datasetId).table(tableId).delete(); } catch(e) {}
        
        // Cria a tabela com o esquema correto
        const [table] = await bq.dataset(datasetId).createTable(tableId, {
            schema: [
                { name: 'id', type: 'INTEGER' },
                { name: 'nome', type: 'STRING' },
                { name: 'cargo', type: 'STRING' },
                { name: 'senha', type: 'STRING' }
            ]
        });

        // 5. Inserir os dados
        await table.insert(usuarios);
        console.log('✅ SUCESSO! Todos os usuários foram cadastrados no BigQuery.');
    } catch (err) {
        console.error('❌ Erro no upload:', err);
        if (err.errors) {
            err.errors.forEach(e => console.error('Detalhe:', e.errors));
        }
    }
}

upload();
