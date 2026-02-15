// src/managers/GestaoManager.js
import { AuthEngine } from '../engines/AuthEngine.js';
import { renderMenuSuperior } from '../components/MenuSuperior.js';
import { renderSubMenuGestao } from '../components/SubMenuGestao.js';
import { UsuariosModule } from '../modules/UsuariosModule.js';
import { ModalNovoUsuario } from '../components/ModalNovoUsuario.js';
import { ModalImportacao } from '../components/ModalImportacao.js';

export const GestaoManager = {
    state: {
        moduloAtivo: 'usuarios' // 'usuarios' | 'empresas' | 'metas'
    },

    async init() {
        console.log("🚀 Iniciando GestaoManager...");

        // 1. Segurança
        const user = AuthEngine.checkAccess();
        if (!user) return;

        // 2. Renderizar Menu Superior (Fixo)
        renderMenuSuperior('menu-superior');

        // 3. Renderizar Submenu e carregar módulo inicial
        this.atualizarInterface();
    },

    atualizarInterface() {
        // Renderiza o Submenu com o estado atual
        renderSubMenuGestao('submenu-gestao', {
            moduloAtivo: this.state.moduloAtivo,
            onTrocarModulo: (novoModulo) => {
                this.state.moduloAtivo = novoModulo;
                this.atualizarInterface(); // Re-renderiza para atualizar abas
            },
            onAddSingle: () => this.handleAddSingle(),
            onAddMass: () => this.handleAddMass()
        });

        // Carrega o conteúdo do módulo selecionado
        this.carregarModulo();
    },

    async carregarModulo() {
        const container = 'conteudo-principal';
        document.getElementById(container).innerHTML = '<div style="text-align:center; padding:50px; opacity:0.5">Carregando...</div>';

        switch (this.state.moduloAtivo) {
            case 'usuarios':
                await UsuariosModule.init(container);
                break;
            case 'empresas':
                document.getElementById(container).innerHTML = '<h2 style="text-align:center">Módulo de Empresas (Em breve)</h2>';
                break;
            default:
                document.getElementById(container).innerHTML = '<h2 style="text-align:center">Módulo em construção</h2>';
        }
    },

    // Ações contextuais (mudam dependendo do módulo)
    handleAddSingle() {
        if (this.state.moduloAtivo === 'usuarios') {
            ModalNovoUsuario.render('modal-container');
        } else {
            alert(`Novo item para ${this.state.moduloAtivo} em breve!`);
        }
    },

    handleAddMass() {
        if (this.state.moduloAtivo === 'usuarios') {
            ModalImportacao.render('modal-container');
        } else {
            alert(`Importação para ${this.state.moduloAtivo} em breve!`);
        }
    }
};