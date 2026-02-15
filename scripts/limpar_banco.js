// scripts/limpar_banco.js
const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');

async function limpar() {
    const bq = new BigQuery({
        keyFilename: path.join(__dirname, '../credentials.json'),
        projectId: 'gupymesa-487420'
    });

    const datasetId = 'sistema_mesa';
    const tableId = 'usuarios';

    try {
        console.log("🧹 INICIANDO LIMPEZA TOTAL DA TABELA USUÁRIOS...");

        // 1. Deletar Tabela Existente
        try {
            await bq.dataset(datasetId).table(tableId).delete();
            console.log("🗑️  Tabela antiga removida.");
        } catch (e) {
            console.log("ℹ️  Tabela não existia ou já estava apagada.");
        }

        // 2. Criar Tabela Vazia com as 5 Colunas + Senha
        const schema = [
            { name: 'id', type: 'INTEGER' },
            { name: 'nome', type: 'STRING' },
            { name: 'cargo', type: 'STRING' },    // Função
            { name: 'contrato', type: 'STRING' }, // CLT/PJ
            { name: 'status', type: 'STRING' },   // Ativo/Inativo
            { name: 'senha', type: 'STRING' }
        ];

        await bq.dataset(datasetId).createTable(tableId, { schema });
        console.log("✨ Tabela 'usuarios' recriada e VAZIA.");
        console.log("👉 Agora você pode usar o botão 'Importar' na tela de Gestão.");

    } catch (err) {
        console.error("❌ Erro:", err.message);
    }
}

limpar();