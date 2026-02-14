import { abrirModalNovoUsuario } from './ModalNovoUsuario.js';
import { abrirModalImportacao } from './ModalImportacao.js';
import { abrirModalNovaEmpresa } from './ModalNovaEmpresa.js';
import { abrirModalImportacaoEmpresas } from './ModalImportacaoEmpresas.js'; // Novo
import { UsuariosModule } from '../modules/UsuariosModule.js';
import { EmpresasModule } from '../modules/EmpresasModule.js';
import { GestaoManager } from '../managers/GestaoManager.js';

export function renderizarSubMenuGestao(containerId, abaAtiva = 'usuarios') {
    const container = document.getElementById(containerId);
    if (!container) return;

    let htmlFiltros = '';
    let htmlTotais = '';

    // --- HTML POR ABA ---
    if (abaAtiva === 'usuarios') {
        htmlFiltros = `
            <select id="filtro-situacao" class="bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs rounded-lg px-2 py-2 outline-none focus:border-indigo-500 cursor-pointer hover:bg-slate-100">
                <option value="ATIVO" selected>⚡ Ativos</option>
                <option value="INATIVO">💤 Inativos</option>
                <option value="TODOS">Todos</option>
            </select>
            <select id="filtro-contrato" class="bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs rounded-lg px-2 py-2 outline-none focus:border-indigo-500 cursor-pointer hover:bg-slate-100">
                <option value="TODOS" selected>📄 Contratos</option>
                <option value="CLT">CLT</option>
                <option value="TERCEIROS">Terceiros</option>
            </select>
            <select id="filtro-funcao" class="bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs rounded-lg px-2 py-2 outline-none focus:border-indigo-500 cursor-pointer hover:bg-slate-100">
                <option value="TODAS" selected>💼 Funções</option>
                <option value="ASSISTENTE">Assistente</option>
                <option value="AUDITORA">Auditora</option>
                <option value="GESTORA">Gestora</option>
            </select>
        `;
        htmlTotais = `
            <div class="hidden xl:flex items-center gap-2 mr-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span>Total: <b class="text-slate-800" id="badge-total">0</b></span>
                <span class="w-px h-3 bg-slate-300 mx-1"></span>
                <span class="text-indigo-600">CLT: <b id="badge-clt">0</b></span>
                <span class="text-indigo-600">Terceiros: <b id="badge-terceiros">0</b></span>
            </div>
        `;
    } else if (abaAtiva === 'empresas') {
        htmlFiltros = `
            <div class="px-2 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 rounded-lg">
                Gerenciamento de Clientes
            </div>
        `;
    }

    // --- RENDERIZAÇÃO ---
    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 mb-4 p-2 flex flex-col 2xl:flex-row items-center justify-between gap-4">
            
            <div class="flex flex-wrap items-center gap-2 w-full 2xl:w-auto">
                <div class="relative group">
                    <input type="text" id="filtro-busca" placeholder="Buscar..." 
                        class="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none w-32 transition-all focus:w-48">
                    <div class="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-indigo-500">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2"></path></svg>
                    </div>
                </div>

                <div class="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
                ${htmlFiltros}
                <div class="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                <button id="btn-novo-cadastro" class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20 active:scale-95 whitespace-nowrap">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    Novo
                </button>
                
                <button id="btn-importar" class="text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 active:scale-95 whitespace-nowrap">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke-width="2"></path></svg>
                    Importar
                </button>
            </div>

            <div class="flex items-center gap-3 w-full 2xl:w-auto justify-between 2xl:justify-end border-t 2xl:border-t-0 border-slate-100 pt-2 2xl:pt-0">
                ${htmlTotais}
                <div class="flex bg-slate-100 p-1 rounded-lg">
                    ${botaoTab('usuarios', 'Usuários', abaAtiva === 'usuarios')}
                    ${botaoTab('empresas', 'Empresas', abaAtiva === 'empresas')}
                    ${botaoTab('metas', 'Metas', abaAtiva === 'metas')}
                    ${botaoTab('assertividade', 'Assertividade', abaAtiva === 'assertividade')}
                </div>
            </div>
        </div>
    `;

    // --- EVENTOS ---
    const inputBusca = document.getElementById('filtro-busca');
    if(inputBusca) {
        inputBusca.addEventListener('input', (e) => {
            if(abaAtiva === 'usuarios') UsuariosModule.aplicarFiltros({ termo: e.target.value });
            if(abaAtiva === 'empresas') EmpresasModule.aplicarFiltros({ termo: e.target.value });
        });
    }

    if (abaAtiva === 'usuarios') {
        document.getElementById('filtro-situacao')?.addEventListener('change', (e) => UsuariosModule.aplicarFiltros({ situacao: e.target.value }));
        document.getElementById('filtro-contrato')?.addEventListener('change', (e) => UsuariosModule.aplicarFiltros({ contrato: e.target.value }));
        document.getElementById('filtro-funcao')?.addEventListener('change', (e) => UsuariosModule.aplicarFiltros({ funcao: e.target.value }));
    }

    // BOTÃO NOVO (Inteligente)
    const btnNovo = document.getElementById('btn-novo-cadastro');
    if (btnNovo) {
        btnNovo.addEventListener('click', () => {
            if(abaAtiva === 'usuarios') abrirModalNovoUsuario();
            if(abaAtiva === 'empresas') abrirModalNovaEmpresa(); // Chama modal vazio (Novo)
        });
    }

    // BOTÃO IMPORTAR (Inteligente)
    const btnImportar = document.getElementById('btn-importar');
    if (btnImportar) {
        btnImportar.addEventListener('click', () => {
            if(abaAtiva === 'usuarios') abrirModalImportacao();
            if(abaAtiva === 'empresas') abrirModalImportacaoEmpresas(); // Chama modal novo
        });
    }

    // ABAS
    ['usuarios', 'empresas', 'metas', 'assertividade'].forEach(aba => {
        const btn = document.getElementById(`tab-${aba}`);
        if(btn) btn.addEventListener('click', () => GestaoManager.mudarAba(aba));
    });
}

function botaoTab(id, label, ativo = false) {
    const css = ativo 
        ? 'bg-white text-indigo-600 shadow-sm' 
        : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-200/50';
    return `<button id="tab-${id}" class="px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wide transition-all ${css}">${label}</button>`;
}

// --- FUNÇÃO GLOBAL DE EDIÇÃO DE EMPRESA ---
// Precisa estar no escopo global para o onclick da tabela funcionar
window.editarEmpresa = (id) => {
    const empresa = EmpresasModule.obterEmpresa(id);
    if (empresa) {
        abrirModalNovaEmpresa(empresa); // Chama modal com dados (Edição)
    } else {
        alert("Erro: Empresa não encontrada.");
    }
};