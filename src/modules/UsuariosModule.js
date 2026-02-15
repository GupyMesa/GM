// src/modules/UsuariosModule.js
import { renderTabelaUsuarios } from './TabelaUsuarios.js';

export const UsuariosModule = {
    /**
     * Inicializa o módulo de usuários: busca dados e renderiza
     */
    async init(containerId) {
        try {
            const container = document.getElementById(containerId);
            if (!container) return;

            container.innerHTML = '<div style="text-align:center; padding: 20px; color: #fff;">Carregando equipe...</div>';

            const response = await fetch('/api/usuarios');
            if (!response.ok) throw new Error('Falha ao buscar usuários');

            const usuarios = await response.json();
            renderTabelaUsuarios(containerId, usuarios);
            
        } catch (error) {
            console.error('Erro no módulo de usuários:', error);
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `<div style="color: #ff453a; text-align: center; padding: 20px;">Erro ao carregar dados: ${error.message}</div>`;
            }
        }
    }
};