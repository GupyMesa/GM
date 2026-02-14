import { renderizarTabelaUsuarios } from './TabelaUsuarios.js';

export const UsuariosModule = {
    
    KEY_STORAGE: 'gupymesa_usuarios_v1',
    
    // Estado atual dos filtros
    filtrosAtuais: {
        termo: '',
        situacao: 'ATIVO', // Padrão: mostrar apenas ativos
        contrato: 'TODOS',
        funcao: 'TODAS'
    },

    dadosIniciais: [
        { id: "1074360", nome: "Aparecida Paiola", contrato: "TERCEIROS", situacao: "ATIVO", funcao: "ASSISTENTE" },
        { id: "988232", nome: "Brenda Ramalho", contrato: "CLT", situacao: "ATIVO", funcao: "AUDITORA" },
        { id: "432243", nome: "Patrícia", contrato: "CLT", situacao: "ATIVO", funcao: "GESTORA" },
        { id: "879833", nome: "Aline", contrato: "CLT", situacao: "INATIVO", funcao: "ASSISTENTE" }
    ],

    init() {
        if (!localStorage.getItem(this.KEY_STORAGE)) {
            this.salvarTodos(this.dadosIniciais);
        }
        // Aplica os filtros iniciais ao carregar
        this.aplicarFiltros();
    },

    getUsuarios() {
        const dados = localStorage.getItem(this.KEY_STORAGE);
        return dados ? JSON.parse(dados) : [];
    },

    salvarTodos(listaUsuarios) {
        localStorage.setItem(this.KEY_STORAGE, JSON.stringify(listaUsuarios));
        this.aplicarFiltros(); // Atualiza a tela após salvar
    },

    adicionarUsuario(usuario) {
        const lista = this.getUsuarios();
        if (lista.some(u => u.id == usuario.id)) {
            throw new Error(`O ID ${usuario.id} já está cadastrado!`);
        }
        lista.unshift(usuario);
        this.salvarTodos(lista);
    },

    // Função central de filtragem
    aplicarFiltros(novosFiltros = {}) {
        // 1. Atualiza o estado dos filtros com o que veio de novo
        this.filtrosAtuais = { ...this.filtrosAtuais, ...novosFiltros };
        
        const listaCompleta = this.getUsuarios();
        const f = this.filtrosAtuais;

        // 2. Filtra a lista
        const listaFiltrada = listaCompleta.filter(user => {
            // Filtro de Texto (Nome ou ID)
            const bateuTermo = !f.termo || 
                user.nome.toLowerCase().includes(f.termo.toLowerCase()) || 
                user.id.includes(f.termo);

            // Filtro de Situação (Ativo/Inativo/Todos)
            const bateuSituacao = f.situacao === 'TODOS' || user.situacao === f.situacao;

            // Filtro de Contrato
            const bateuContrato = f.contrato === 'TODOS' || user.contrato === f.contrato;

            // Filtro de Função
            const bateuFuncao = f.funcao === 'TODAS' || user.funcao === f.funcao;

            return bateuTermo && bateuSituacao && bateuContrato && bateuFuncao;
        });

        // 3. Renderiza
        renderizarTabelaUsuarios('conteudo-principal', listaFiltrada);
    },

    processarCSV(textoCSV) {
        const linhas = textoCSV.split('\n');
        const novosUsuarios = [];
        let erros = 0;

        for (let i = 1; i < linhas.length; i++) {
            const linha = linhas[i].trim();
            if (!linha) continue;
            const colunas = linha.split(',');

            if (colunas.length < 5) { erros++; continue; }

            let contrato = colunas[2].trim().toUpperCase();
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

        const listaAtual = this.getUsuarios();
        novosUsuarios.forEach(novo => {
            const index = listaAtual.findIndex(u => u.id === novo.id);
            if (index >= 0) listaAtual[index] = novo;
            else listaAtual.push(novo);
        });

        this.salvarTodos(listaAtual);
        return { total: novosUsuarios.length, erros };
    }
};