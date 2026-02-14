/**
 * COMPONENTE: MODAL NOVO USUÁRIO
 * Formulário estrito com as 5 colunas do CSV.
 */
export function abrirModalNovoUsuario() {
    // Verifica se já existe modal, se não cria
    let modal = document.getElementById('modal-novo-usuario');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-novo-usuario';
        modal.className = 'fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm hidden';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold text-slate-800">Novo Cadastro</h3>
                    <button id="btn-fechar-modal" class="text-slate-400 hover:text-rose-500">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                </div>
                
                <form id="form-novo-usuario" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">ID Assistente</label>
                        <input type="number" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                        <input type="text" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Contrato</label>
                            <select class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                <option value="CLT">CLT</option>
                                <option value="PJ">PJ</option>
                                <option value="ESTAGIO">ESTÁGIO</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Função</label>
                            <select class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                                <option value="ASSISTENTE">ASSISTENTE</option>
                                <option value="AUDITORA">AUDITORA</option>
                                <option value="GESTORA">GESTORA</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Situação Inicial</label>
                        <select class="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none">
                            <option value="ATIVO">ATIVO</option>
                            <option value="INATIVO">INATIVO</option>
                        </select>
                    </div>

                    <div class="pt-4 border-t border-slate-100 mt-4">
                        <p class="text-[10px] text-slate-400 mb-4 text-center">
                            * A senha inicial será definida automaticamente como <strong>gupy123</strong>.
                        </p>
                        <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-500/30">
                            Cadastrar Usuário
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Evento Fechar
        document.getElementById('btn-fechar-modal').onclick = () => modal.classList.add('hidden');
    }

    // Abre o modal
    modal.classList.remove('hidden');
}