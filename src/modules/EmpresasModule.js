// src/modules/EmpresasModule.js
import { renderTabelaEmpresas } from './TabelaEmpresas.js';

export const EmpresasModule = {
    async init(containerId) {
        try {
            const container = document.getElementById(containerId);
            if (!container) return;

            // Busca dados da API que criamos no server.js
            const response = await fetch('/api/empresas');
            if (!response.ok) throw new Error('Falha ao buscar empresas');
            
            const empresas = await response.json();
            
            // Renderiza se houver dados, senão mostra mensagem vazia
            if (empresas.length === 0) {
                container.innerHTML = '<div style="text-align:center; padding:40px; color:rgba(255,255,255,0.5)">Nenhuma empresa cadastrada.</div>';
            } else {
                renderTabelaEmpresas(containerId, empresas);
            }
            
        } catch (error) {
            console.error('Erro Empresas:', error);
            document.getElementById(containerId).innerHTML = `
                <div style="color:#ff453a; text-align:center; padding:40px">
                    Erro ao carregar empresas: ${error.message}
                </div>`;
        }
    }
};