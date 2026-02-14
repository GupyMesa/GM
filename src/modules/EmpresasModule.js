import { renderizarTabelaEmpresas } from './TabelaEmpresas.js';

export const EmpresasModule = {
    
    KEY_STORAGE: 'gupymesa_empresas_v1',
    
    filtrosAtuais: {
        termo: ''
    },

    // Dados iniciais de exemplo (Baseado no seu CSV)
    dadosIniciais: [
        { id: "56467", nome: "3778", subdominio: "3778inc", data_entrada: "", obs: "Desativada" },
        { id: "40368", nome: "4MK Solutions", subdominio: "4MK", data_entrada: "", obs: "" },
        { id: "772", nome: "Ahgora", subdominio: "ahgora", data_entrada: "", obs: "" },
        { id: "55214", nome: "Amcham", subdominio: "amcham", data_entrada: "13/03/2023", obs: "não está na planilha" }
    ],

    init() {
        if (!localStorage.getItem(this.KEY_STORAGE)) {
            this.salvarTodos(this.dadosIniciais);
        }
        this.aplicarFiltros();
    },

    getEmpresas() {
        const dados = localStorage.getItem(this.KEY_STORAGE);
        return dados ? JSON.parse(dados) : [];
    },

    salvarTodos(lista) {
        localStorage.setItem(this.KEY_STORAGE, JSON.stringify(lista));
        this.aplicarFiltros();
    },

    adicionarEmpresa(empresa) {
        const lista = this.getEmpresas();
        const idNovo = String(empresa.id).trim();

        if (lista.some(e => String(e.id).trim() === idNovo)) {
            throw new Error(`O ID ${idNovo} já está cadastrado.`);
        }

        lista.unshift(empresa);
        this.salvarTodos(lista);
    },

    aplicarFiltros(novosFiltros = {}) {
        this.filtrosAtuais = { ...this.filtrosAtuais, ...novosFiltros };
        const f = this.filtrosAtuais;
        
        const lista = this.getEmpresas();
        const listaFiltrada = lista.filter(emp => {
            if (!f.termo) return true;
            const termo = f.termo.toLowerCase();
            return emp.nome.toLowerCase().includes(termo) || 
                   emp.subdominio.toLowerCase().includes(termo) ||
                   String(emp.id).includes(termo);
        });

        renderizarTabelaEmpresas('conteudo-principal', listaFiltrada);
        // Aqui poderíamos atualizar totais específicos de empresas se necessário
    },

    processarCSV(textoCSV) {
        const linhas = textoCSV.split('\n');
        const novas = [];
        let erros = 0;

        for (let i = 1; i < linhas.length; i++) {
            const linha = linhas[i].trim();
            if (!linha) continue;
            
            // IMPORTANTE: O CSV de empresas usa ponto e vírgula (;)
            const colunas = linha.split(';');

            if (colunas.length < 3) { erros++; continue; }

            const empresa = {
                id: colunas[0].trim(),
                nome: colunas[1].trim(),
                subdominio: colunas[2].trim(),
                data_entrada: colunas[3] ? colunas[3].trim() : '',
                obs: colunas[4] ? colunas[4].trim() : ''
            };
            novas.push(empresa);
        }

        const listaAtual = this.getEmpresas();
        novas.forEach(nova => {
            const index = listaAtual.findIndex(e => e.id === nova.id);
            if (index >= 0) listaAtual[index] = nova;
            else listaAtual.push(nova);
        });

        this.salvarTodos(listaAtual);
        return { total: novas.length, erros };
    }
};