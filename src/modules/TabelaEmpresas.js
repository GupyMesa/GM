export function renderizarTabelaEmpresas(containerId, dadosLista = []) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!dadosLista || dadosLista.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 text-slate-400">
                <p>Nenhuma empresa encontrada.</p>
            </div>
        `;
        return;
    }

    const htmlLinhas = dadosLista.map(emp => `
        <tr class="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group">
            <td class="py-3 px-4 font-mono text-xs text-slate-500 font-bold">#${emp.id}</td>
            <td class="py-3 px-4 font-bold text-slate-800 text-sm">${emp.nome}</td>
            <td class="py-3 px-4 text-sm text-indigo-600 font-medium">${emp.subdominio}</td>
            <td class="py-3 px-4 text-xs text-slate-500">${emp.data_entrada || '-'}</td>
            <td class="py-3 px-4 text-xs text-slate-400 italic max-w-xs truncate" title="${emp.obs}">${emp.obs || '-'}</td>
            <td class="py-3 px-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="window.editarEmpresa('${emp.id}')" class="text-slate-400 hover:text-indigo-600 transition p-2 hover:bg-indigo-50 rounded-lg" title="Editar Empresa">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </button>
            </td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 bg-slate-50/50">
                        <th class="py-3 px-4 w-24">ID</th>
                        <th class="py-3 px-4">Nome da Empresa</th>
                        <th class="py-3 px-4">Subdomínio</th>
                        <th class="py-3 px-4">Entrada</th>
                        <th class="py-3 px-4">Observação</th>
                        <th class="py-3 px-4 w-16 text-right"></th>
                    </tr>
                </thead>
                <tbody>${htmlLinhas}</tbody>
            </table>
        </div>
    `;
}