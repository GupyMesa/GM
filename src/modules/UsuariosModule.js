import { renderizarTabelaUsuarios } from './TabelaUsuarios.js';

export const UsuariosModule = {
    
    KEY_STORAGE: 'gupymesa_usuarios_v1',
    
    filtrosAtuais: {
        termo: '',
        situacao: 'ATIVO',
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
        this.aplicarFiltros();
    },

    getUsuarios() {
        const dados = localStorage.getItem(this.KEY_STORAGE);
        return dados ? JSON.parse(dados) : [];
    },

    salvarTodos(listaUsuarios) {
        localStorage.setItem(this.KEY_STORAGE, JSON.stringify(listaUsuarios));
        this.aplicarFiltros();
    },

    adicionarUsuario(usuario) {
        const lista = this.getUsuarios();
        if (lista.some(u => u.id == usuario.id)) {
            throw new Error(`O ID ${usuario.id} já está cadastrado!`);
        }
        lista.unshift(usuario);
        this.salvarTodos(lista);
    },

    aplicarFiltros(novosFiltros = {}) {
        this.filtrosAtuais = { ...this.filtrosAtuais, ...novosFiltros };
        
        const listaCompleta = this.getUsuarios();
        const f = this.filtrosAtuais;

        // Filtragem
        const listaFiltrada = listaCompleta.filter(user => {
            const bateuTermo = !f.termo || 
                user.nome.toLowerCase().includes(f.termo.toLowerCase()) || 
                user.id.includes(f.termo);

            const bateuSituacao = f.situacao === 'TODOS' || user.situacao === f.situacao;
            const bateuContrato = f.contrato === 'TODOS' || user.contrato === f.contrato;
            const bateuFuncao = f.funcao === 'TODAS' || user.funcao === f.funcao;

            return bateuTermo && bateuSituacao && bateuContrato && bateuFuncao;
        });

        // Atualiza a Tabela
        renderizarTabelaUsuarios('conteudo-principal', listaFiltrada);

        // Atualiza os Totais (Badges) na interface
        this.atualizarTotaisVisuais(listaFiltrada);
    },

    // Calcula e exibe os totais na barra superior
    atualizarTotaisVisuais(lista) {
        const totais = {
            total: lista.length,
            clt: lista.filter(u => u.contrato === 'CLT').length,
            terceiros: lista.filter(u => u.contrato === 'TERCEIROS').length,
            ativos: lista.filter(u => u.situacao === 'ATIVO').length
        };

        // Atualiza o HTML dos badges se eles existirem
        const elTotal = document.getElementById('badge-total');
        const elCLT = document.getElementById('badge-clt');
        const elTerceiros = document.getElementById('badge-terceiros');

        if (elTotal) elTotal.innerText = totais.total;
        if (elCLT) elCLT.innerText = totais.clt;
        if (elTerceiros) elTerceiros.innerText = totais.terceiros;
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
            // Normalização: Se vier algo diferente, ou mapeia ou ignora.
            // Aqui assumimos que se for PJ vira TERCEIROS, se for Estagio removemos ou mantemos?
            // Pedido: "Não temos estagio". Se vier no CSV, vamos forçar TERCEIROS ou ignorar.
            // Vou forçar a conversão de PJ -> TERCEIROS e manter CLT.
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