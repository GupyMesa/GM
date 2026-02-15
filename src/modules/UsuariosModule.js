// src/modules/UsuariosModule.js
import { renderTabelaUsuarios } from './TabelaUsuarios.js';
import { renderFiltrosEquipe } from '../components/FiltrosEquipe.js';

export const UsuariosModule = {
    dadosOriginais: [],

    async init(containerId) {
        try {
            const container = document.getElementById(containerId);
            if (!container) return;

            // Prepara layout: Área de Filtros + Área da Tabela
            container.innerHTML = `
                <div id="filtros-equipe-container"></div>
                <div id="tabela-equipe-container">
                    <div style="text-align:center; padding:40px; opacity:0.5">Carregando equipe...</div>
                </div>
            `;

            // Busca dados
            const response = await fetch('/api/usuarios');
            if (!response.ok) throw new Error('Erro ao buscar dados');
            
            this.dadosOriginais = await response.json();

            // Extrai opções dinâmicas para os filtros
            const opcoes = {
                contratos: [...new Set(this.dadosOriginais.map(u => u.contrato || 'CLT'))].filter(Boolean),
                funcoes: [...new Set(this.dadosOriginais.map(u => u.cargo || 'Indefinido'))].filter(Boolean),
                status: ['ATIVO', 'INATIVO']
            };

            // Renderiza Filtros
            renderFiltrosEquipe('filtros-equipe-container', opcoes, (filtros) => {
                this.aplicarFiltros(filtros);
            });

            // Renderiza Tabela Inicial (Apenas Ativos por padrão, ou todos se preferir)
            this.aplicarFiltros({ contrato: '', funcao: '', status: 'ATIVO', busca: '' });
            
        } catch (error) {
            console.error('Erro:', error);
            document.getElementById(containerId).innerHTML = `
                <div style="color:#ff453a; text-align:center; padding:40px">
                    Erro ao carregar módulo de equipe: ${error.message}
                </div>`;
        }
    },

    aplicarFiltros(filtros) {
        const dadosFiltrados = this.dadosOriginais.filter(u => {
            // Normaliza dados para evitar erros de case/null
            const contrato = (u.contrato || '').toUpperCase(); // Assumindo que virá do banco futuramente
            const cargo = (u.cargo || '').toUpperCase();
            // A lógica de status aqui é um placeholder, pois sua tabela atual só tem "Ativo" hardcoded na visualização anterior
            // Mas vamos preparar para quando vier do banco real
            const status = (u.status || 'ATIVO').toUpperCase(); 
            const termo = filtros.busca;

            const matchContrato = !filtros.contrato || contrato === filtros.contrato.toUpperCase();
            const matchFuncao = !filtros.funcao || cargo === filtros.funcao.toUpperCase();
            const matchStatus = !filtros.status || status === filtros.status.toUpperCase();
            
            const matchBusca = !termo || 
                u.nome.toLowerCase().includes(termo) || 
                u.id.toString().includes(termo);

            return matchContrato && matchFuncao && matchStatus && matchBusca;
        });

        renderTabelaUsuarios('tabela-equipe-container', dadosFiltrados);
    }
};