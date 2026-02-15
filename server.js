// server.js
const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

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

// IMPORTAÇÃO VIA LOAD JOB (COM POLLING MANUAL)
app.post('/api/usuarios/import', async (req, res) => {
    const tempFilePath = path.join(__dirname, 'temp_import_users.json');

    try {
        const novosUsuarios = req.body;
        
        // 1. Validação
        if (!Array.isArray(novosUsuarios) || novosUsuarios.length === 0) {
            return res.status(400).json({ mensagem: 'Nenhum dado válido enviado.' });
        }

        console.log(`📥 Processando ${novosUsuarios.length} usuários...`);

        // 2. Filtrar Duplicados (Checagem no Banco)
        const idsParaVerificar = novosUsuarios.map(u => u.id).filter(id => !isNaN(id));
        let idsExistentes = new Set();
        
        if (idsParaVerificar.length > 0) {
            try {
                // Unnest é mais seguro e performático para listas grandes
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

        const usuariosParaInserir = novosUsuarios.filter(u => !idsExistentes.has(u.id));

        if (usuariosParaInserir.length === 0) {
            return res.json({ mensagem: 'Todos os usuários já estão cadastrados.', inseridos: 0 });
        }

        // 3. Criar Arquivo NDJSON
        const ndjson = usuariosParaInserir.map(u => JSON.stringify(u)).join('\n');
        fs.writeFileSync(tempFilePath, ndjson);

        console.log(`🚀 Iniciando Load Job para ${usuariosParaInserir.length} registros...`);

        // 4. Iniciar Load Job
        const [job] = await bq
            .dataset(DATASET)
            .table(TABLE_USERS)
            .load(tempFilePath, {
                sourceFormat: 'NEWLINE_DELIMITED_JSON',
                writeDisposition: 'WRITE_APPEND',
            });

        console.log(`⏳ Job ${job.id} iniciado. Monitorando status...`);

        // 5. POLLING: Aguardar Conclusão Manualmente
        // Isso substitui o job.on('complete') que estava falhando
        let jobDone = false;
        while (!jobDone) {
            const [metadata] = await job.getMetadata();
            const state = metadata.status.state;

            if (state === 'DONE') {
                jobDone = true;
                if (metadata.status.errorResult) {
                    throw new Error('Falha no BigQuery: ' + metadata.status.errorResult.message);
                }
            } else {
                // Espera 500ms antes de checar novamente
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        console.log("✅ Carga concluída com sucesso!");

        // Limpeza
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

        res.json({ 
            mensagem: `Sucesso! ${usuariosParaInserir.length} usuários importados.`,
            inseridos: usuariosParaInserir.length,
            ignorados: idsExistentes.size
        });

    } catch (error) {
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

        console.error('❌ ERRO LOAD JOB:', error);
        
        let msg = error.message;
        if (error.errors && error.errors.length > 0) {
            msg = error.errors.map(e => e.message).join(' | ');
        }
        
        res.status(500).json({ mensagem: 'Erro no servidor: ' + msg });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('🚀 Servidor rodando na porta ' + PORT));