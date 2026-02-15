const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');

const app = express();
app.use(express.json({ limit: '10mb' })); // Aumentado limite para uploads grandes
app.use(express.static('.'));

const bq = new BigQuery({
    keyFilename: path.join(__dirname, 'credentials.json'),
    projectId: 'gupymesa-487420',
    location: 'southamerica-east1'
});

// --- ROTAS ---

// Login
app.post('/api/login', async (req, res) => {
    const { id, senha } = req.body;
    try {
        // Agora buscamos mais dados no login para o frontend usar
        const query = `
            SELECT id, nome, cargo, contrato, status 
            FROM \`gupymesa-487420.sistema_mesa.usuarios\` 
            WHERE id = @id AND senha = @senha 
            LIMIT 1`;
        
        const [rows] = await bq.query({ query, params: { id: parseInt(id), senha } });

        if (rows.length > 0) res.json({ sucesso: true, usuario: rows[0] });
        else res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas' });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: error.message });
    }
});

// Listar Usuários
app.get('/api/usuarios', async (req, res) => {
    try {
        const query = `SELECT * FROM \`gupymesa-487420.sistema_mesa.usuarios\` LIMIT 2000`;
        const [rows] = await bq.query({ query });
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Listar Empresas
app.get('/api/empresas', async (req, res) => {
    try {
        const query = `SELECT * FROM \`gupymesa-487420.sistema_mesa.empresas\` LIMIT 1000`;
        const [rows] = await bq.query({ query });
        res.json(rows);
    } catch (error) { res.json([]); } // Retorna vazio se tabela não existir
});

// IMPORTAÇÃO COM VALIDAÇÃO DE ID
app.post('/api/usuarios/import', async (req, res) => {
    try {
        const novosUsuarios = req.body; // Array de {id, nome, ...}
        if (!novosUsuarios || novosUsuarios.length === 0) {
            return res.status(400).json({ mensagem: 'Nenhum dado enviado.' });
        }

        // 1. Buscar IDs que já existem no banco para não duplicar
        const idsParaVerificar = novosUsuarios.map(u => u.id).join(',');
        
        // Se a lista for muito grande, a query pode falhar. 
        // Para produção robusta, faríamos em lotes. Aqui, para simplificar:
        const checkQuery = `
            SELECT id FROM \`gupymesa-487420.sistema_mesa.usuarios\`
            WHERE id IN (${idsParaVerificar})
        `;
        
        let idsExistentes = new Set();
        try {
            const [rows] = await bq.query({ query: checkQuery });
            rows.forEach(r => idsExistentes.add(r.id));
        } catch(e) { 
            // Se der erro (ex: tabela vazia), assumimos que nenhum existe
        }

        // 2. Filtrar apenas os novos
        const usuariosParaInserir = novosUsuarios.filter(u => !idsExistentes.has(u.id));

        if (usuariosParaInserir.length === 0) {
            return res.json({ mensagem: 'Todos os usuários enviados já existem no banco.', inseridos: 0 });
        }

        // 3. Inserir (Streaming Insert para respostas rápidas de UI)
        // Nota: No Free Tier o streaming tem limitações, mas para pequenas cargas funciona ou usamos fallback.
        // Se falhar, o frontend avisa.
        await bq.dataset('sistema_mesa').table('usuarios').insert(usuariosParaInserir);

        res.json({ 
            mensagem: `Importação concluída! ${usuariosParaInserir.length} novos usuários inseridos.`,
            inseridos: usuariosParaInserir.length,
            ignorados: idsExistentes.size
        });

    } catch (error) {
        console.error('Erro Import:', error);
        res.status(500).json({ mensagem: 'Erro ao importar: ' + error.message });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('🚀 Server ON port ' + PORT));