// src/modules/UsuariosModule.js
import { renderTabelaUsuarios } from './TabelaUsuarios.js';
import { GestaoManager } from '../managers/GestaoManager.js';

export const UsuariosModule = {
    dadosOriginais: [],
    estadoFiltros: {
        busca: '',
        contrato: '',
        funcao: '',
        status: 'ATIVO', // Padrão
        aberto: false    // Gaveta fechada
    },

    async init(containerId) {
        try {
            const container = document.getElementById(containerId);
            if (!container) return;

            // Limpa container (agora só tem a tabela)
            container.innerHTML = `
                <div id="tabela-equipe-container">
                    <div style="text-align:center; padding:40px; opacity:0.5">Carregando equipe...</div>
                </div>
            `;

            // Busca dados
            const response = await fetch('/api/usuarios');
            if (!response.ok) throw new Error('Erro ao buscar dados');
            
            this.dadosOriginais = await response.json();

            // Configura Filtros na Barra Superior
            this.configurarFiltros();

            // Renderiza Tabela Inicial
            this.aplicarFiltros();
            
        } catch (error) {
            console.error('Erro:', error);
            document.getElementById(containerId).innerHTML = `<div style="color:#ff453a; text-align:center">Erro: ${error.message}</div>`;
        }
    },

    configurarFiltros() {
        // Extrai opções únicas
        const contratos = [...new Set(this.dadosOriginais.map(u => u.contrato || 'CLT'))].filter(Boolean);
        const funcoes = [...new Set(this.dadosOriginais.map(u => u.cargo || 'Indefinido'))].filter(Boolean);

        // Envia configuração para o Manager atualizar o Submenu
        GestaoManager.updateToolbar({
            ativo: this.estadoFiltros.aberto,
            aberto: this.estadoFiltros.aberto,
            valoresAtuais: this.estadoFiltros,
            opcoes: { contratos, funcoes },
            
            onToggle: (novoEstado) => {
                this.estadoFiltros.aberto = novoEstado;
                // Não precisa re-renderizar tudo, o CSS cuida da animação
            },
            
            onFiltrar: (novosValores) => {
                // Atualiza estado e reaplica
                this.estadoFiltros = { ...this.estadoFiltros, ...novosValores };
                this.aplicarFiltros();
            }
        });
    },

    aplicarFiltros() {
        const { busca, contrato, funcao, status } = this.estadoFiltros;
        const termo = busca.toLowerCase();

        const dadosFiltrados = this.dadosOriginais.filter(u => {
            const uContrato = (u.contrato || '').toUpperCase();
            const uCargo = (u.cargo || '').toUpperCase();
            const uStatus = (u.status || 'ATIVO').toUpperCase();
            
            const matchContrato = !contrato || uContrato === contrato.toUpperCase();
            const matchFuncao = !funcao || uCargo === funcao.toUpperCase();
            const matchStatus = !status || uStatus === status.toUpperCase();
            const matchBusca = !termo || 
                u.nome.toLowerCase().includes(termo) || 
                u.id.toString().includes(termo);

            return matchContrato && matchFuncao && matchStatus && matchBusca;
        });

        renderTabelaUsuarios('tabela-equipe-container', dadosFiltrados);
    }
};