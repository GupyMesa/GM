// server.js
const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');
const cors = require('cors'); // Boa prática para evitar erros de origem

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Aumentado para suportar CSVs grandes
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

// IMPORTAÇÃO COM VALIDAÇÃO DE ID (CORRIGIDA)
app.post('/api/usuarios/import', async (req, res) => {
    try {
        const novosUsuarios = req.body;
        
        // 1. Validação Básica
        if (!Array.isArray(novosUsuarios) || novosUsuarios.length === 0) {
            return res.status(400).json({ mensagem: 'Nenhum dado válido enviado.' });
        }

        console.log(`📥 Recebendo ${novosUsuarios.length} usuários para importação...`);

        // 2. Buscar IDs existentes (Lógica Otimizada)
        const idsParaVerificar = novosUsuarios.map(u => u.id).filter(id => !isNaN(id));
        
        let idsExistentes = new Set();
        
        if (idsParaVerificar.length > 0) {
            try {
                // Monta a query de forma segura
                const query = `
                    SELECT id FROM \`${DATASET}.${TABLE_USERS}\`
                    WHERE id IN UNNEST(@ids)
                `;
                
                const [rows] = await bq.query({
                    query,
                    params: { ids: idsParaVerificar }
                });
                
                rows.forEach(r => idsExistentes.add(r.id));
                console.log(`🔍 Encontrados ${idsExistentes.size} IDs já cadastrados.`);
            } catch (err) {
                console.warn("⚠️  Aviso ao verificar duplicidade (pode ser tabela vazia):", err.message);
                // Se der erro na verificação (ex: tabela não existe), tentamos inserir tudo
            }
        }

        // 3. Filtrar Duplicados
        const usuariosParaInserir = novosUsuarios.filter(u => !idsExistentes.has(u.id));

        if (usuariosParaInserir.length === 0) {
            console.log("⏹️  Todos os usuários já existem.");
            return res.json({ mensagem: 'Todos os usuários enviados já estão cadastrados.', inseridos: 0 });
        }

        // 4. Inserir no BigQuery
        console.log(`🚀 Inserindo ${usuariosParaInserir.length} novos usuários...`);
        
        await bq.dataset(DATASET).table(TABLE_USERS).insert(usuariosParaInserir);

        res.json({ 
            mensagem: `Sucesso! ${usuariosParaInserir.length} usuários importados.`,
            inseridos: usuariosParaInserir.length,
            ignorados: idsExistentes.size
        });

    } catch (error) {
        // Log detalhado do erro para debug
        console.error('❌ ERRO CRÍTICO NA IMPORTAÇÃO:', JSON.stringify(error, null, 2));
        
        let msg = error.message;
        if (error.errors && error.errors.length > 0) {
            msg = error.errors.map(e => e.message).join(' | ');
        }
        
        res.status(500).json({ mensagem: 'Erro no servidor: ' + msg });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('🚀 Servidor rodando na porta ' + PORT));