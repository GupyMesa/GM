import { abrirModalNovoUsuario } from './ModalNovoUsuario.js';
import { abrirModalImportacao } from './ModalImportacao.js';
import { UsuariosModule } from '../modules/UsuariosModule.js';

export function renderizarSubMenuGestao(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col gap-0 overflow-hidden">
            
            <div class="p-3 flex flex-wrap items-center justify-between gap-4 bg-white">
                
                <div class="flex flex-wrap items-center gap-2">
                    
                    <div class="relative group">
                        <input type="text" id="filtro-busca" placeholder="Buscar..." 
                            class="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-40 transition-all focus:w-60">
                        <div class="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-indigo-500">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2"></path></svg>
                        </div>
                    </div>

                    <div class="h-6 w-px bg-slate-200 mx-1"></div>

                    <select id="filtro-situacao" class="bg-slate-50 border-0 ring-1 ring-slate-200 text-slate-600 font-bold text-xs rounded-lg px-2 py-2 outline-none focus:ring-indigo-500 cursor-pointer hover:bg-slate-100">
                        <option value="ATIVO" selected>⚡ Ativos</option>
                        <option value="INATIVO">💤 Inativos</option>
                        <option value="TODOS">Todos</option>
                    </select>

                    <select id="filtro-contrato" class="bg-slate-50 border-0 ring-1 ring-slate-200 text-slate-600 font-bold text-xs rounded-lg px-2 py-2 outline-none focus:ring-indigo-500 cursor-pointer hover:bg-slate-100">
                        <option value="TODOS" selected>📄 Contratos</option>
                        <option value="CLT">CLT</option>
                        <option value="TERCEIROS">Terceiros</option>
                    </select>

                    <select id="filtro-funcao" class="bg-slate-50 border-0 ring-1 ring-slate-200 text-slate-600 font-bold text-xs rounded-lg px-2 py-2 outline-none focus:ring-indigo-500 cursor-pointer hover:bg-slate-100">
                        <option value="TODAS" selected>💼 Funções</option>
                        <option value="ASSISTENTE">Assistente</option>
                        <option value="AUDITORA">Auditora</option>
                        <option value="GESTORA">Gestora</option>
                    </select>
                </div>

                <div class="flex items-center gap-3 ml-auto">
                    
                    <div class="hidden xl:flex items-center gap-2 mr-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <span>Total: <b class="text-slate-800" id="badge-total">0</b></span>
                        <span class="w-px h-3 bg-slate-300 mx-1"></span>
                        <span class="text-indigo-600">CLT: <b id="badge-clt">0</b></span>
                        <span class="w-px h-3 bg-slate-300 mx-1"></span>
                        <span class="text-indigo-600">Terceiros: <b id="badge-terceiros">0</b></span>
                    </div>

                    <button id="btn-novo-cadastro" class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20 active:scale-95">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        Novo
                    </button>
                    
                    <button id="btn-importar" class="text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 active:scale-95">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke-width="2"></path></svg>
                        Importar
                    </button>
                </div>
            </div>

            <div class="bg-slate-50 px-4 pt-2 border-t border-slate-100 flex gap-1">
                ${botaoTab('usuarios', 'Usuários', true)}
                ${botaoTab('empresas', 'Empresas')}
                ${botaoTab('metas', 'Metas')}
                ${botaoTab('assertividade', 'Assertividade')}
            </div>
        </div>
    `;

    // --- EVENTOS ---
    const inputBusca = document.getElementById('filtro-busca');
    inputBusca.addEventListener('input', (e) => UsuariosModule.aplicarFiltros({ termo: e.target.value }));

    document.getElementById('filtro-situacao').addEventListener('change', (e) => UsuariosModule.aplicarFiltros({ situacao: e.target.value }));
    document.getElementById('filtro-contrato').addEventListener('change', (e) => UsuariosModule.aplicarFiltros({ contrato: e.target.value }));
    document.getElementById('filtro-funcao').addEventListener('change', (e) => UsuariosModule.aplicarFiltros({ funcao: e.target.value }));

    const btnNovo = document.getElementById('btn-novo-cadastro');
    if (btnNovo) btnNovo.addEventListener('click', () => abrirModalNovoUsuario());

    const btnImportar = document.getElementById('btn-importar');
    if (btnImportar) btnImportar.addEventListener('click', () => abrirModalImportacao());
}

function botaoTab(id, label, ativo = false) {
    const css = ativo 
        ? 'bg-white text-indigo-600 border-t border-x border-slate-200 rounded-t-lg font-bold shadow-sm relative top-px' 
        : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-200/50 rounded-t-lg font-medium';
    return `<button id="tab-${id}" class="px-6 py-2 text-xs uppercase tracking-wide transition-all ${css}">${label}</button>`;
}