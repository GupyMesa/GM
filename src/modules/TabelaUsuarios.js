import { AuthEngine } from '../engines/AuthEngine.js';

/**
 * COMPONENTE: TABELA DE USUÁRIOS
 * Exibe as 5 colunas críticas do CSV de importação.
 */
export function renderizarTabelaUsuarios(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // SIMULAÇÃO DOS DADOS (Baseado no seu CSV)
    const usuarios = [
        { id: "1074360", nome: "Aparecida Paiola", contrato: "PJ", situacao: "ATIVO", funcao: "ASSISTENTE" },
        { id: "988232", nome: "Brenda Ramalho", contrato: "CLT", situacao: "ATIVO", funcao: "AUDITORA" },
        { id: "432243", nome: "Patrícia", contrato: "CLT", situacao: "ATIVO", funcao: "GESTORA" },
        { id: "879833", nome: "Aline", contrato: "CLT", situacao: "INATIVO", funcao: "ASSISTENTE" },
        { id: "1185327", nome: "Pedro Gabriel Silva Neto", contrato: "PJ", situacao: "ATIVO", funcao: "ASSISTENTE" }
    ];

    const htmlLinhas = usuarios.map(user => {
        // Lógica visual para Status
        const statusClass = user.situacao === 'ATIVO' 
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
            : 'bg-rose-100 text-rose-700 border-rose-200';
        
        // Lógica visual para Contrato
        const contratoClass = user.contrato === 'PJ' 
            ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
            : 'bg-slate-100 text-slate-700 border-slate-200';

        return `
        <tr class="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group">
            <td class="py-3 px-4 font-mono text-xs text-slate-500 font-bold">#${user.id}</td>
            
            <td class="py-3 px-4">
                <div class="font-bold text-slate-800 text-sm">${user.nome}</div>
            </td>
            
            <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${contratoClass}">
                    ${user.contrato}
                </span>
            </td>

            <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${statusClass}">
                    ${user.situacao}
                </span>
            </td>

            <td class="py-3 px-4 text-xs font-semibold text-slate-600 uppercase">
                ${user.funcao}
            </td>

            <td class="py-3 px-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                <button onclick="window.resetarSenha('${user.id}', '${user.nome}')" 
                        class="text-slate-400 hover:text-amber-600 transition p-1" title="Resetar Senha para Padrão">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </button>
                <button class="text-slate-400 hover:text-blue-600 transition p-1" title="Editar Usuário">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
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
                <tbody>
                    ${htmlLinhas}
                </tbody>
            </table>
        </div>
    `;
}

// Expõe a função de reset globalmente para o botão funcionar (Temporário até termos eventos melhores)
window.resetarSenha = (id, nome) => {
    if(confirm(`ATENÇÃO: Deseja resetar a senha de ${nome} para 'gupy123'?`)) {
        AuthEngine.resetarSenhaUsuario(id);
        alert(`Senha de ${nome} restaurada com sucesso!`);
    }
};