import { renderizarSubMenuGestao } from '../components/SubMenuGestao.js';
import { UsuariosModule } from '../modules/UsuariosModule.js';
import { EmpresasModule } from '../modules/EmpresasModule.js';

export const GestaoManager = {
    // Agora a aba padrão é 'gestor' (Painel Principal)
    abaAtiva: 'gestor', 

    init() {
        this.renderizarAba();
    },

    mudarAba(novaAba) {
        this.abaAtiva = novaAba;
        this.renderizarAba();
    },

    renderizarAba() {
        // 1. Renderiza o SubMenu correto (com filtros e abas atualizadas)
        renderizarSubMenuGestao('sub-menu-gestao', this.abaAtiva);

        // 2. Lógica de renderização do conteúdo principal
        const container = document.getElementById('conteudo-principal');
        
        if (this.abaAtiva === 'usuarios') {
            UsuariosModule.init();
        } else if (this.abaAtiva === 'empresas') {
            EmpresasModule.init();
        } else if (this.abaAtiva === 'gestor') {
            // Placeholder para o futuro Painel do Gestor (Metas)
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center h-96 text-slate-400">
                    <div class="bg-indigo-50 p-6 rounded-full mb-4">
                        <svg class="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold text-slate-700">Painel do Gestor</h3>
                    <p class="text-sm">Visualização de Metas e Produtividade em breve.</p>
                </div>
            `;
        } else if (this.abaAtiva === 'auditora') {
            // Placeholder para o futuro Painel da Auditora (Assertividade)
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center h-96 text-slate-400">
                    <div class="bg-emerald-50 p-6 rounded-full mb-4">
                        <svg class="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold text-slate-700">Painel da Auditora</h3>
                    <p class="text-sm">Controle de Qualidade e Assertividade em breve.</p>
                </div>
            `;
        }
    }
};