// src/managers/GestaoManager.js
import { AuthEngine } from '../engines/AuthEngine.js';
import { renderMenuSuperior } from '../components/MenuSuperior.js';
import { renderSubMenuGestao } from '../components/SubMenuGestao.js';
import { UsuariosModule } from '../modules/UsuariosModule.js';
import { EmpresasModule } from '../modules/EmpresasModule.js'; // Novo Import
import { ModalNovoUsuario } from '../components/ModalNovoUsuario.js';
import { ModalImportacao } from '../components/ModalImportacao.js';

export const GestaoManager = {
    state: {
        moduloAtivo: 'usuarios' // padrao
    },

    async init() {
        console.log("🚀 Iniciando GestaoManager...");
        const user = AuthEngine.checkAccess();
        if (!user) return;

        renderMenuSuperior('menu-superior');
        this.atualizarInterface();
    },

    atualizarInterface() {
        renderSubMenuGestao('submenu-gestao', {
            moduloAtivo: this.state.moduloAtivo,
            onTrocarModulo: (novoModulo) => {
                this.state.moduloAtivo = novoModulo;
                this.atualizarInterface();
            },
            onAddSingle: () => this.handleAddSingle(),
            onAddMass: () => this.handleAddMass()
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
                await EmpresasModule.init(container); // Agora funcional
                break;
            case 'gestoras':
                document.getElementById(container).innerHTML = '<div style="text-align:center; padding:50px; color:#fff">Visualização de Gestoras (Em breve)</div>';
                break;
            case 'auditoras':
                document.getElementById(container).innerHTML = '<div style="text-align:center; padding:50px; color:#fff">Visualização de Auditoras (Em breve)</div>';
                break;
            default:
                document.getElementById(container).innerHTML = 'Módulo desconhecido';
        }
    },

    handleAddSingle() {
        const modulo = this.state.moduloAtivo;
        if (modulo === 'usuarios') ModalNovoUsuario.render('modal-container');
        else if (modulo === 'empresas') alert('Modal de Nova Empresa em desenvolvimento');
        else alert(`Ação de novo registro para ${modulo}`);
    },

    handleAddMass() {
        ModalImportacao.render('modal-container');
    }
};