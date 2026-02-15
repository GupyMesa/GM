// src/managers/GestaoManager.js
import { AuthEngine } from '../engines/AuthEngine.js';
import { renderMenuSuperior } from '../components/MenuSuperior.js';
import { renderSubMenuGestao } from '../components/SubMenuGestao.js';
import { UsuariosModule } from '../modules/UsuariosModule.js';
import { EmpresasModule } from '../modules/EmpresasModule.js';
import { ModalNovoUsuario } from '../components/ModalNovoUsuario.js';
import { ModalImportacao } from '../components/ModalImportacao.js';

export const GestaoManager = {
    state: {
        moduloAtivo: 'usuarios',
        filtrosConfig: null // Armazena config atual dos filtros
    },

    async init() {
        console.log("🚀 Iniciando GestaoManager...");
        const user = AuthEngine.checkAccess();
        if (!user) return;

        renderMenuSuperior('menu-superior');
        this.atualizarInterface();
    },

    // Método chamado pelos Módulos para injetar filtros na barra
    updateToolbar(config) {
        this.state.filtrosConfig = config;
        // Re-renderiza apenas o submenu para mostrar os novos filtros
        renderSubMenuGestao('submenu-gestao', {
            moduloAtivo: this.state.moduloAtivo,
            onTrocarModulo: (novo) => this.trocarModulo(novo),
            onAddSingle: () => this.handleAddSingle(),
            onAddMass: () => this.handleAddMass(),
            filtrosConfig: this.state.filtrosConfig
        });
    },

    trocarModulo(novoModulo) {
        this.state.moduloAtivo = novoModulo;
        this.state.filtrosConfig = null; // Limpa filtros ao trocar de aba
        this.atualizarInterface();
    },

    atualizarInterface() {
        // Renderiza submenu padrão (sem filtros ainda)
        renderSubMenuGestao('submenu-gestao', {
            moduloAtivo: this.state.moduloAtivo,
            onTrocarModulo: (novo) => this.trocarModulo(novo),
            onAddSingle: () => this.handleAddSingle(),
            onAddMass: () => this.handleAddMass(),
            filtrosConfig: this.state.filtrosConfig
        });
        this.carregarModulo();
    },

    async carregarModulo() {
        const container = 'conteudo-principal';
        document.getElementById(container).innerHTML = '<div style="text-align:center; padding:50px; opacity:0.5">Carregando dados...</div>';

        switch (this.state.moduloAtivo) {
            case 'usuarios':
                await UsuariosModule.init(container);
                break;
            case 'empresas':
                await EmpresasModule.init(container);
                break;
            default:
                document.getElementById(container).innerHTML = '<div style="text-align:center; padding:50px">Módulo em desenvolvimento</div>';
        }
    },

    handleAddSingle() {
        if (this.state.moduloAtivo === 'usuarios') ModalNovoUsuario.render('modal-container');
        else alert('Funcionalidade em breve');
    },

    handleAddMass() {
        ModalImportacao.render('modal-container');
    }
};