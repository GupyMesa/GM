// src/modules/UsuariosModule.js
import { renderTabelaUsuarios } from './TabelaUsuarios.js';

export const UsuariosModule = {
    async init(containerId) {
        try {
            const container = document.getElementById(containerId);
            if (!container) return;

            // Busca dados
            const response = await fetch('/api/usuarios');
            if (!response.ok) throw new Error('Erro ao buscar dados');
            
            const usuarios = await response.json();
            
            // Renderiza a tabela usando o componente visual
            renderTabelaUsuarios(containerId, usuarios);
            
        } catch (error) {
            console.error('Erro:', error);
            document.getElementById(containerId).innerHTML = `
                <div style="color:#ff453a; text-align:center; padding:40px">
                    Erro ao carregar equipe: ${error.message}
                </div>`;
        }
    }
};