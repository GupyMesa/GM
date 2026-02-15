// server.js
const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');
const cors = require('cors');
const fs = require('fs'); // Necessário para criar arquivo temporário

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

const bq = new BigQuery({
    keyFilename: path.join(__dirname, 'credentials.json'),
    projectId: 'gupymesa-487420',
    location: 'southamerica-east1'
});

const DATASET = 'sistema_mesa';
const TABLE_USERS = 'usuarios';

// --- ROTAS ---

// Login
app.post('/api/login', async (req, res) => {
    const { id, senha } = req.body;
    try {
        const query = `
            SELECT id, nome, cargo, contrato, status 
            FROM \`${DATASET}.${TABLE_USERS}\` 
            WHERE id = @id AND senha = @senha 
            LIMIT 1`;
        
        const [rows] = await bq.query({ query, params: { id: parseInt(id), senha } });

        if (rows.length > 0) res.json({ sucesso: true, usuario: rows[0] });
        else res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas' });
    } catch (error) {
        console.error('Erro Login:', error);
        res.status(500).json({ sucesso: false, mensagem: error.message });
    }
});

// Listar Usuários
app.get('/api/usuarios', async (req, res) => {
    try {
        const query = `SELECT * FROM \`${DATASET}.${TABLE_USERS}\` LIMIT 2000`;
        const [rows] = await bq.query({ query });
        res.json(rows);
    } catch (error) {
        console.error('Erro Listar Usuários:', error);
        res.status(500).json({ error: error.message });
    }
});

// Listar Empresas
app.get('/api/empresas', async (req, res) => {
    try {
        const query = `SELECT * FROM \`${DATASET}.empresas\` LIMIT 1000`;
        const [rows] = await bq.query({ query });
        res.json(rows);
    } catch (error) { res.json([]); }
});

// IMPORTAÇÃO VIA LOAD JOB (Compatível com Free Tier)
app.post('/api/usuarios/import', async (req, res) => {
    const tempFilePath = path.join(__dirname, 'temp_import_users.json');

    try {
        const novosUsuarios = req.body;
        
        // 1. Validação Básica
        if (!Array.isArray(novosUsuarios) || novosUsuarios.length === 0) {
            return res.status(400).json({ mensagem: 'Nenhum dado válido enviado.' });
        }

        console.log(`📥 Processando ${novosUsuarios.length} usuários...`);

        // 2. Buscar IDs existentes para evitar duplicidade
        const idsParaVerificar = novosUsuarios.map(u => u.id).filter(id => !isNaN(id));
        let idsExistentes = new Set();
        
        if (idsParaVerificar.length > 0) {
            try {
                const query = `
                    SELECT id FROM \`${DATASET}.${TABLE_USERS}\`
                    WHERE id IN UNNEST(@ids)
                `;
                const [rows] = await bq.query({ query, params: { ids: idsParaVerificar } });
                rows.forEach(r => idsExistentes.add(r.id));
            } catch (err) {
                console.warn("⚠️  Aviso verificação IDs:", err.message);
            }
        }

        // 3. Filtrar novos
        const usuariosParaInserir = novosUsuarios.filter(u => !idsExistentes.has(u.id));

        if (usuariosParaInserir.length === 0) {
            return res.json({ mensagem: 'Todos os usuários já estão cadastrados.', inseridos: 0 });
        }

        // 4. Criar Arquivo NDJSON (Newline Delimited JSON)
        // O BigQuery Load Job exige um arquivo onde cada linha é um JSON válido.
        const ndjson = usuariosParaInserir.map(u => JSON.stringify(u)).join('\n');
        fs.writeFileSync(tempFilePath, ndjson);

        console.log(`🚀 Iniciando Load Job para ${usuariosParaInserir.length} registros...`);

        // 5. Executar Load Job
        const [job] = await bq
            .dataset(DATASET)
            .table(TABLE_USERS)
            .load(tempFilePath, {
                sourceFormat: 'NEWLINE_DELIMITED_JSON',
                writeDisposition: 'WRITE_APPEND', // Adiciona aos dados existentes
            });

        console.log(`⏳ Job ${job.id} iniciado. Aguardando conclusão...`);
        
        // Aguarda o fim do processamento
        await job.on('complete');
        
        console.log("✅ Carga concluída com sucesso!");

        // Remove o arquivo temporário
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

        res.json({ 
            mensagem: `Sucesso! ${usuariosParaInserir.length} usuários importados via Load Job.`,
            inseridos: usuariosParaInserir.length,
            ignorados: idsExistentes.size
        });

    } catch (error) {
        // Limpeza em caso de erro
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

        console.error('❌ ERRO LOAD JOB:', JSON.stringify(error, null, 2));
        
        let msg = error.message;
        if (error.errors && error.errors.length > 0) {
            msg = error.errors.map(e => e.message).join(' | ');
        }
        
        res.status(500).json({ mensagem: 'Erro no servidor: ' + msg });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('🚀 Servidor rodando na porta ' + PORT));