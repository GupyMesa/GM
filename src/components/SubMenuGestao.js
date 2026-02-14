export function renderizarSubMenuGestao(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
            
            <div class="flex flex-wrap items-center gap-3">
                <div class="relative">
                    <input type="text" id="busca-usuario" placeholder="Buscar usuário..." 
                        class="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64">
                    <div class="absolute left-3 top-2.5 text-slate-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </div>
                </div>
                <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2">
                    <span>+</span> Novo Cadastro
                </button>
                <button class="bg-slate-800 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    Importar
                </button>
            </div>

            <div class="flex items-center bg-slate-100 p-1 rounded-xl">
                ${botaoAba('usuarios', 'Usuários', true)}
                ${botaoAba('empresas', 'Empresas')}
                ${botaoAba('metas', 'Metas')}
                ${botaoAba('assertividade', 'Assertividade')}
            </div>
        </div>
    `;
}

function botaoAba(id, label, ativo = false) {
    const classeAtivo = ativo ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700';
    return `
        <button id="tab-${id}" class="px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${classeAtivo}">
            ${label}
        </button>
    `;
}