import { abrirModalNovoUsuario } from './ModalNovoUsuario.js';
import { abrirModalImportacao } from './ModalImportacao.js';

export function renderizarSubMenuGestao(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
            
            <div class="flex flex-wrap items-center gap-2">
                <div class="relative">
                    <input type="text" id="busca-usuario" placeholder="Buscar usuários..." 
                        class="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-60 transition-all focus:w-72">
                    <div class="absolute left-3 top-2.5 text-slate-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </div>
                </div>

                <button id="btn-novo-cadastro" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    Novo Cadastro
                </button>

                <button id="btn-importar" class="bg-slate-800 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 active:scale-95">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    Importar
                </button>
            </div>

            <div class="flex items-center bg-slate-100 p-1 rounded-xl self-end lg:self-center">
                ${botaoTab('usuarios', 'Usuários', true)}
                ${botaoTab('empresas', 'Empresas')}
                ${botaoTab('metas', 'Metas')}
                ${botaoTab('assertividade', 'Assertividade')}
            </div>
        </div>
    `;

    // Conecta o evento do botão Novo Cadastro
    const btnNovo = document.getElementById('btn-novo-cadastro');
    if (btnNovo) {
        btnNovo.addEventListener('click', () => {
            abrirModalNovoUsuario();
        });
    }

    // Conecta o evento do botão Importar
    const btnImportar = document.getElementById('btn-importar');
    if (btnImportar) {
        btnImportar.addEventListener('click', () => {
            abrirModalImportacao();
        });
    }
}

// Função auxiliar para gerar HTML dos botões de aba
function botaoTab(id, label, ativo = false) {
    const css = ativo ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-500 hover:bg-slate-200/50';
    return `<button id="tab-${id}" class="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${css}">${label}</button>`;
}