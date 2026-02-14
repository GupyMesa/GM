import { AuthEngine } from '../engines/AuthEngine.js';

export function renderizarTabelaUsuarios(containerId, dadosLista = []) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Se a lista estiver vazia, mostra mensagem
    if (!dadosLista || dadosLista.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 text-slate-400">
                <svg class="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                <p>Nenhum usuário cadastrado.</p>
            </div>
        `;
        return;
    }

    const htmlLinhas = dadosLista.map(user => {
        const statusClass = user.situacao === 'ATIVO' 
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
            : 'bg-rose-100 text-rose-700 border-rose-200';
        
        const contratoClass = (user.contrato === 'TERCEIROS' || user.contrato === 'PJ')
            ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
            : 'bg-slate-100 text-slate-700 border-slate-200';

        return `
        <tr class="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group">
            <td class="py-3 px-4 font-mono text-xs text-slate-500 font-bold">#${user.id}</td>
            <td class="py-3 px-4"><div class="font-bold text-slate-800 text-sm">${user.nome}</div></td>
            <td class="py-3 px-4"><span class="px-2 py-0.5 rounded text-[10px] font-bold border ${contratoClass}">${user.contrato}</span></td>
            <td class="py-3 px-4"><span class="px-2 py-0.5 rounded text-[10px] font-bold border ${statusClass}">${user.situacao}</span></td>
            <td class="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">${user.funcao}</td>
            <td class="py-3 px-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="window.resetarSenha('${user.id}', '${user.nome}')" class="text-slate-400 hover:text-amber-600 transition p-1" title="Resetar Senha">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </button>
            </td>
        </tr>
    `}).join('');

    container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 bg-slate-50/50">
                        <th class="py-3 px-4 w-24">ID Assist</th>
                        <th class="py-3 px-4">Nome Assistente</th>
                        <th class="py-3 px-4 w-24">Contrato</th>
                        <th class="py-3 px-4 w-24">Situação</th>
                        <th class="py-3 px-4 w-32">Função</th>
                        <th class="py-3 px-4 w-24 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody>${htmlLinhas}</tbody>
            </table>
        </div>
    `;
}

window.resetarSenha = (id, nome) => {
    if(confirm(`ATENÇÃO: Deseja resetar a senha de ${nome} para 'gupy123'?`)) {
        AuthEngine.resetarSenhaUsuario(id);
        alert(`Senha de ${nome} restaurada com sucesso!`);
    }
};