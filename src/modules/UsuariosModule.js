import { renderizarTabelaUsuarios } from './TabelaUsuarios.js';

/**
 * MÓDULO: GERENCIADOR DE USUÁRIOS (CONTROLLER)
 * Responsável por CRUD local e Importação de CSV.
 */
export const UsuariosModule = {
    
    KEY_STORAGE: 'gupymesa_usuarios_v1',

    // Dados iniciais para não começar vazio (Backup do que você já tinha)
    dadosIniciais: [
        { id: "1074360", nome: "Aparecida Paiola", contrato: "TERCEIROS", situacao: "ATIVO", funcao: "ASSISTENTE" },
        { id: "988232", nome: "Brenda Ramalho", contrato: "CLT", situacao: "ATIVO", funcao: "AUDITORA" },
        { id: "432243", nome: "Patrícia", contrato: "CLT", situacao: "ATIVO", funcao: "GESTORA" }
    ],

    init() {
        // Se não tiver nada salvo, salva os iniciais
        if (!localStorage.getItem(this.KEY_STORAGE)) {
            this.salvarTodos(this.dadosIniciais);
        }
        this.atualizarInterface();
    },

    // Retorna todos os usuários salvos
    getUsuarios() {
        const dados = localStorage.getItem(this.KEY_STORAGE);
        return dados ? JSON.parse(dados) : [];
    },

    // Salva a lista completa
    salvarTodos(listaUsuarios) {
        localStorage.setItem(this.KEY_STORAGE, JSON.stringify(listaUsuarios));
        this.atualizarInterface();
    },

    // Adiciona um único usuário (Cadastro Manual)
    adicionarUsuario(usuario) {
        const lista = this.getUsuarios();
        
        // Verifica duplicidade de ID
        if (lista.some(u => u.id == usuario.id)) {
            throw new Error(`O ID ${usuario.id} já está cadastrado!`);
        }

        lista.unshift(usuario); // Adiciona no topo
        this.salvarTodos(lista);
        console.log("✅ Usuário salvo localmente:", usuario);
    },

    // Processa o arquivo CSV
    processarCSV(textoCSV) {
        const linhas = textoCSV.split('\n');
        const novosUsuarios = [];
        let erros = 0;

        // Pula o cabeçalho (linha 0) e começa da 1
        for (let i = 1; i < linhas.length; i++) {
            const linha = linhas[i].trim();
            if (!linha) continue;

            // Divide por vírgula (ajustar se o CSV usar ponto e vírgula)
            const colunas = linha.split(',');

            // Validação básica: Precisa ter pelo menos 5 colunas
            if (colunas.length < 5) {
                erros++;
                continue;
            }

            // Mapeamento das colunas do seu CSV
            // 0: ID, 1: NOME, 2: CONTRATO, 3: SITUAÇÃO, 4: FUNÇÃO
            let contrato = colunas[2].trim().toUpperCase();
            
            // Regra de Negócio: Transformar PJ em TERCEIROS
            if (contrato === 'PJ') contrato = 'TERCEIROS';

            const usuario = {
                id: colunas[0].trim(),
                nome: colunas[1].trim(),
                contrato: contrato,
                situacao: colunas[3].trim().toUpperCase(),
                funcao: colunas[4].trim().toUpperCase()
            };

            novosUsuarios.push(usuario);
        }

        // Mescla com os existentes (Atualiza se ID existir, adiciona se não)
        const listaAtual = this.getUsuarios();
        
        novosUsuarios.forEach(novo => {
            const index = listaAtual.findIndex(u => u.id === novo.id);
            if (index >= 0) {
                listaAtual[index] = novo; // Atualiza
            } else {
                listaAtual.push(novo); // Adiciona
            }
        });

        this.salvarTodos(listaAtual);
        return { total: novosUsuarios.length, erros };
    },

    // Força a tabela a se redesenhar
    atualizarInterface() {
        const lista = this.getUsuarios();
        renderizarTabelaUsuarios('conteudo-principal', lista);
    }
};