import { EmpresasModule } from '../modules/EmpresasModule.js';

export function abrirModalNovaEmpresa() {
    let modal = document.getElementById('modal-nova-empresa');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-nova-empresa';
        modal.className = 'fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm hidden transition-opacity opacity-0';
        
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 transform transition-all scale-95 opacity-0" id="modal-content-empresa">
                <div class="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                    <h3 class="text-2xl font-black text-slate-800 tracking-tight">Nova Empresa</h3>
                    <button id="btn-fechar-modal-empresa" class="text-slate-300 hover:text-rose-500 transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                </div>
                
                <form id="form-nova-empresa" class="space-y-4">
                    <div class="grid grid-cols-3 gap-4">
                        <div class="col-span-1">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">ID Empresa</label>
                            <input type="number" name="id" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>
                        <div class="col-span-2">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subdomínio</label>
                            <input type="text" name="subdominio" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nome da Empresa</label>
                        <input type="text" name="nome" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Data Entrada</label>
                            <input type="text" name="data_entrada" placeholder="DD/MM/AAAA" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Observação</label>
                            <input type="text" name="obs" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                        </div>
                    </div>

                    <div class="pt-6">
                        <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-500/20">
                            Salvar Empresa
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        const fechar = () => {
            modal.classList.add('opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 200);
        };

        document.getElementById('btn-fechar-modal-empresa').onclick = fechar;
        modal.addEventListener('click', (e) => { if (e.target === modal) fechar(); });

        document.getElementById('form-nova-empresa').addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            try {
                EmpresasModule.adicionarEmpresa({
                    id: fd.get('id'),
                    nome: fd.get('nome'),
                    subdominio: fd.get('subdominio'),
                    data_entrada: fd.get('data_entrada'),
                    obs: fd.get('obs')
                });
                e.target.reset();
                fechar();
                alert('Empresa salva com sucesso!');
            } catch (err) {
                alert(err.message);
            }
        });
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('#modal-content-empresa').classList.remove('scale-95');
        modal.querySelector('#modal-content-empresa').classList.add('scale-100');
    }, 10);
}