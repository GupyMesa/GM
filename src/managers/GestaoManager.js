// src/managers/GestaoManager.js
import { AuthEngine } from '../engines/AuthEngine.js';
import { renderMenuSuperior } from '../components/MenuSuperior.js';
import { UsuariosModule } from '../modules/UsuariosModule.js';

export const GestaoManager = {
    /**
     * Inicializa a tela de Gestão
     */
    async init() {
        console.log("🚀 Iniciando GestaoManager...");

        // 1. Verificação de Segurança (Redireciona se não estiver logado)
        const user = AuthEngine.checkAccess();
        if (!user) return; // O checkAccess já redireciona

        // 2. Renderizar Menu Superior
        console.log("🎨 Renderizando Menu...");
        renderMenuSuperior('menu-superior');

        // 3. Carregar Módulo Inicial (Usuários)
        console.log("👥 Carregando Módulo de Usuários...");
        await UsuariosModule.init('conteudo-principal');
    }
};