import { abrirModalNovoUsuario } from './ModalNovoUsuario.js';
import { abrirModalImportacao } from './ModalImportacao.js';
import { UsuariosModule } from '../modules/UsuariosModule.js'; // Importar o módulo

export function renderizarSubMenuGestao(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6 overflow-hidden">
            
            <div class="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div class="flex flex-wrap items-center gap-2">
                    <div class="relative">
                        <input type="text" id="filtro-busca" placeholder="Buscar por Nome ou ID..." 
                            class="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-60 transition-all focus:w-72">
                        <div class="absolute left-3 top-2.5 text-slate-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        </div>
                    </div>

                    <div class="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                    <button id="btn-novo-cadastro" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        Novo
                    </button>
                    <button id="btn-importar" class="bg-slate-800 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 active:scale-95">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        Importar
                    </button>
                </div>

                <div class="flex items-center bg-slate-100 p-1 rounded-xl self-start lg:self-center">
                    ${botaoTab('usuarios', 'Usuários', true)}
                    ${botaoTab('empresas', 'Empresas')}
                    ${botaoTab('metas', 'Metas')}
                    ${botaoTab('assertividade', 'Assertividade')}
                </div>
            </div>

            <div class="bg-slate-50 border-t border-slate-100 px-4 py-3 flex flex-wrap items-center gap-4 text-sm">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    Filtrar por:
                </span>

                <select id="filtro-situacao" class="bg-white border border-slate-200 text-slate-600 font-semibold text-xs rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 hover:border-indigo-300 cursor-pointer transition-colors">
                    <option value="ATIVO" selected>⚡ Ativos</option>
                    <option value="INATIVO">💤 Inativos</option>
                    <option value="TODOS">Todas Situações</option>
                </select>

                <select id="filtro-contrato" class="bg-white border border-slate-200 text-slate-600 font-semibold text-xs rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 hover:border-indigo-300 cursor-pointer transition-colors">
                    <option value="TODOS" selected>📄 Todos Contratos</option>
                    <option value="CLT">CLT</option>
                    <option value="TERCEIROS">Terceiros</option>
                    <option value="ESTAGIO">Estágio</option>
                </select>

                <select id="filtro-funcao" class="bg-white border border-slate-200 text-slate-600 font-semibold text-xs rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 hover:border-indigo-300 cursor-pointer transition-colors">
                    <option value="TODAS" selected>💼 Todas Funções</option>
                    <option value="ASSISTENTE">Assistente</option>
                    <option value="AUDITORA">Auditora</option>
                    <option value="GESTORA">Gestora</option>
                </select>
            </div>
        </div>
    `;

    // --- EVENTOS ---

    // 1. Busca por Texto (Input)
    const inputBusca = document.getElementById('filtro-busca');
    inputBusca.addEventListener('input', (e) => {
        UsuariosModule.aplicarFiltros({ termo: e.target.value });
    });

    // 2. Filtro Situação
    document.getElementById('filtro-situacao').addEventListener('change', (e) => {
        UsuariosModule.aplicarFiltros({ situacao: e.target.value });
    });

    // 3. Filtro Contrato
    document.getElementById('filtro-contrato').addEventListener('change', (e) => {
        UsuariosModule.aplicarFiltros({ contrato: e.target.value });
    });

    // 4. Filtro Função
    document.getElementById('filtro-funcao').addEventListener('change', (e) => {
        UsuariosModule.aplicarFiltros({ funcao: e.target.value });
    });

    // Botões de Modal (Mantidos)
    const btnNovo = document.getElementById('btn-novo-cadastro');
    if (btnNovo) btnNovo.addEventListener('click', () => abrirModalNovoUsuario());

    const btnImportar = document.getElementById('btn-importar');
    if (btnImportar) btnImportar.addEventListener('click', () => abrirModalImportacao());
}

function botaoTab(id, label, ativo = false) {
    const css = ativo ? 'bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100' : 'text-slate-500 hover:text-indigo-500 hover:bg-slate-200/50';
    return `<button id="tab-${id}" class="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${css}">${label}</button>`;
}