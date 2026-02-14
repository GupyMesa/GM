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

    /**
     * CADASTRO MANUAL COM TRAVA DE ID
     */
    adicionarUsuario(usuario) {
        const lista = this.getUsuarios();
        
        // Normaliza o ID para comparação (Remove espaços e garante string)
        const idNovo = String(usuario.id).trim();

        // TRAVA DE SEGURANÇA:
        // Verifica se EXATAMENTE este ID já existe.
        // Nota: Não verificamos nome, pois a mesma pessoa pode ter 2 IDs.
        const idExiste = lista.some(u => String(u.id).trim() === idNovo);

        if (idExiste) {
            throw new Error(`O ID ${idNovo} já possui cadastro no sistema.`);
        }

        lista.unshift(usuario); // Adiciona no topo da lista
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

        renderizarTabelaUsuarios('conteudo-principal', listaFiltrada);
        this.atualizarTotaisVisuais(listaFiltrada);
    },

    atualizarTotaisVisuais(lista) {
        const totais = {
            total: lista.length,
            clt: lista.filter(u => u.contrato === 'CLT').length,
            terceiros: lista.filter(u => u.contrato === 'TERCEIROS').length,
            ativos: lista.filter(u => u.situacao === 'ATIVO').length
        };

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
            if (contrato === 'PJ') contrato = 'TERCEIROS';
            
            const usuario = {
                id: colunas[0].trim(), // Remove espaços do ID
                nome: colunas[1].trim(),
                contrato: contrato,
                situacao: colunas[3].trim().toUpperCase(),
                funcao: colunas[4].trim().toUpperCase()
            };
            novosUsuarios.push(usuario);
        }

        const listaAtual = this.getUsuarios();
        
        // Na importação, se o ID já existe, atualizamos os dados (Upsert)
        // Se for ID novo, adicionamos.
        novosUsuarios.forEach(novo => {
            const index = listaAtual.findIndex(u => u.id === novo.id);
            if (index >= 0) {
                listaAtual[index] = novo; // Atualiza cadastro existente
            } else {
                listaAtual.push(novo); // Cria novo ID
            }
        });

        this.salvarTodos(listaAtual);
        return { total: novosUsuarios.length, erros };
    }
};