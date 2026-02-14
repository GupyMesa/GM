import { AuthEngine } from '../engines/AuthEngine.js';

export function abrirModalNovoUsuario() {
    // Verifica se o modal já existe no DOM
    let modal = document.getElementById('modal-novo-usuario');
    
    // Se não existir, cria o HTML do zero
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-novo-usuario';
        modal.className = 'fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm hidden transition-opacity opacity-0';
        
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 transform transition-all scale-95 opacity-0" id="modal-content">
                <div class="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                    <div>
                        <h3 class="text-2xl font-black text-slate-800 tracking-tight">Novo Cadastro</h3>
                        <p class="text-xs text-slate-500 font-medium mt-1">Preencha os dados conforme o padrão GupyMesa.</p>
                    </div>
                    <button id="btn-fechar-modal" class="text-slate-300 hover:text-rose-500 transition p-1 rounded-full hover:bg-rose-50">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                </div>
                
                <form id="form-novo-usuario" class="space-y-5">
                    
                    <div class="grid grid-cols-3 gap-4">
                        <div class="col-span-1">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ID Assistente</label>
                            <input type="number" name="id_assistente" required placeholder="Ex: 1074360"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition">
                        </div>
                        
                        <div class="col-span-2">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Situação</label>
                            <select name="situacao" class="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer">
                                <option value="ATIVO" selected>ATIVO</option>
                                <option value="INATIVO">INATIVO</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nome Completo</label>
                        <input type="text" name="nome_assist" required placeholder="Nome do assistente"
                            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contrato</label>
                            <select name="contrato" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
                                <option value="CLT">CLT</option>
                                <option value="PJ">PJ</option>
                                <option value="ESTAGIO">ESTÁGIO</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Função</label>
                            <select name="funcao" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer">
                                <option value="ASSISTENTE">ASSISTENTE</option>
                                <option value="AUDITORA">AUDITORA</option>
                                <option value="GESTORA">GESTORA</option>
                            </select>
                        </div>
                    </div>

                    <div class="pt-6 border-t border-slate-100 mt-6 bg-slate-50 -mx-8 -mb-8 p-6 rounded-b-2xl">
                        <div class="flex items-center gap-3 mb-4 text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-200">
                            <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            <p>Senha inicial definida como: <strong class="text-slate-800 font-mono">gupy123</strong></p>
                        </div>
                        <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-indigo-500/20 active:scale-95">
                            Confirmar Cadastro
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Lógica de Fechar
        const fechar = () => {
            modal.classList.add('opacity-0');
            modal.querySelector('#modal-content').classList.remove('scale-100');
            modal.querySelector('#modal-content').classList.add('scale-95');
            setTimeout(() => modal.classList.add('hidden'), 200);
        };

        document.getElementById('btn-fechar-modal').onclick = fechar;
        
        // Fecha ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) fechar();
        });

        // Lógica de Submit
        document.getElementById('form-novo-usuario').addEventListener('submit', (e) => {
            e.preventDefault();
            // Aqui você conectará com o AuthEngine ou API
            alert("Usuário cadastrado com sucesso! (Simulação)");
            fechar();
        });
    }

    // Lógica de Abrir com Animação
    modal.classList.remove('hidden');
    // Pequeno delay para permitir a transição CSS funcionar
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        const content = modal.querySelector('#modal-content');
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100');
    }, 10);
}