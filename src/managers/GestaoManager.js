// src/managers/GestaoManager.js
import { AuthEngine } from '../engines/AuthEngine.js';
import { renderMenuSuperior } from '../components/MenuSuperior.js';
import { renderSubMenuGestao } from '../components/SubMenuGestao.js';
import { UsuariosModule } from '../modules/UsuariosModule.js';
import { ModalNovoUsuario } from '../components/ModalNovoUsuario.js';
import { ModalImportacao } from '../components/ModalImportacao.js';

export const GestaoManager = {
    async init() {
        console.log("🚀 Iniciando GestaoManager...");

        // 1. Segurança
        const user = AuthEngine.checkAccess();
        if (!user) return;

        // 2. Renderizar Menu Superior
        renderMenuSuperior('menu-superior');

        // 3. Renderizar Submenu com Ações
        renderSubMenuGestao('submenu-gestao', {
            onAddSingle: () => ModalNovoUsuario.render('modal-container'),
            onAddMass: () => ModalImportacao.render('modal-container')
        });

        // 4. Carregar Tabela de Usuários
        await UsuariosModule.init('conteudo-principal');
    }
};