import { renderizarSubMenuGestao } from '../components/SubMenuGestao.js';
import { UsuariosModule } from '../modules/UsuariosModule.js';
import { EmpresasModule } from '../modules/EmpresasModule.js';

export const GestaoManager = {
    abaAtiva: 'usuarios', // Estado inicial

    init() {
        this.renderizarAba();
    },

    mudarAba(novaAba) {
        this.abaAtiva = novaAba;
        this.renderizarAba();
    },

    renderizarAba() {
        // 1. Renderiza o SubMenu correto (com filtros específicos)
        renderizarSubMenuGestao('sub-menu-gestao', this.abaAtiva);

        // 2. Carrega o Módulo de Dados correspondente
        if (this.abaAtiva === 'usuarios') {
            UsuariosModule.init();
        } else if (this.abaAtiva === 'empresas') {
            EmpresasModule.init();
        } else {
            document.getElementById('conteudo-principal').innerHTML = `
                <div class="flex items-center justify-center h-64 text-slate-400">
                    <p>Módulo ${this.abaAtiva} em desenvolvimento.</p>
                </div>
            `;
        }
    }
};