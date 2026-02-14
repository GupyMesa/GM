import { EmpresasModule } from '../modules/EmpresasModule.js';

// Aceita um objeto opcional 'empresaParaEditar'
export function abrirModalNovaEmpresa(empresaParaEditar = null) {
    let modal = document.getElementById('modal-nova-empresa');
    
    // Se não existir, cria
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-nova-empresa';
        modal.className = 'fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm hidden transition-opacity opacity-0';
        
        // Estrutura HTML
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 transform transition-all scale-95 opacity-0" id="modal-content-empresa">
                <div class="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                    <div>
                        <h3 class="text-2xl font-black text-slate-800 tracking-tight" id="titulo-modal-empresa">Nova Empresa</h3>
                        <p class="text-xs text-slate-500 font-medium mt-1">Preencha os dados cadastrais</p>
                    </div>
                    <button id="btn-fechar-modal-empresa" class="text-slate-300 hover:text-rose-500 transition p-1 rounded-full hover:bg-rose-50">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                </div>
                
                <form id="form-nova-empresa" class="space-y-4">
                    <input type="hidden" id="modo-edicao" value="false">
                    
                    <div class="grid grid-cols-3 gap-4">
                        <div class="col-span-1">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">ID Empresa</label>
                            <input type="number" name="id" id="input-id-empresa" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:bg-slate-100">
                        </div>
                        <div class="col-span-2">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Subdomínio</label>
                            <input type="text" name="subdominio" id="input-sub-empresa" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition">
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nome da Empresa</label>
                        <input type="text" name="nome" id="input-nome-empresa" required class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Data Entrada</label>
                            <input type="text" name="data_entrada" id="input-data-empresa" placeholder="DD/MM/AAAA" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Observação</label>
                            <input type="text" name="obs" id="input-obs-empresa" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition">
                        </div>
                    </div>

                    <div class="pt-6 border-t border-slate-100 mt-6">
                        <button type="submit" id="btn-submit-empresa" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-500/20 active:scale-95">
                            Salvar Empresa
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Lógica de Fechar
        const fechar = () => {
            modal.classList.add('opacity-0');
            modal.querySelector('#modal-content-empresa').classList.remove('scale-100');
            modal.querySelector('#modal-content-empresa').classList.add('scale-95');
            setTimeout(() => modal.classList.add('hidden'), 200);
        };

        document.getElementById('btn-fechar-modal-empresa').onclick = fechar;
        modal.addEventListener('click', (e) => { if (e.target === modal) fechar(); });

        // Lógica de Submit (Novo ou Edição)
        document.getElementById('form-nova-empresa').addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            const isEdicao = document.getElementById('modo-edicao').value === 'true';

            const dados = {
                id: fd.get('id'),
                nome: fd.get('nome'),
                subdominio: fd.get('subdominio'),
                data_entrada: fd.get('data_entrada'),
                obs: fd.get('obs')
            };

            try {
                if (isEdicao) {
                    EmpresasModule.atualizarEmpresa(dados);
                    alert('Empresa atualizada com sucesso!');
                } else {
                    EmpresasModule.adicionarEmpresa(dados);
                    alert('Empresa cadastrada com sucesso!');
                }
                e.target.reset();
                fechar();
            } catch (err) {
                alert(err.message);
            }
        });
    }

    // --- CONFIGURAÇÃO DO ESTADO (NOVO vs EDITAR) ---
    const form = document.getElementById('form-nova-empresa');
    const titulo = document.getElementById('titulo-modal-empresa');
    const btnSubmit = document.getElementById('btn-submit-empresa');
    const inputId = document.getElementById('input-id-empresa');
    const modoEdicao = document.getElementById('modo-edicao');

    form.reset(); // Limpa antes de abrir

    if (empresaParaEditar) {
        // MODO EDIÇÃO
        modoEdicao.value = 'true';
        titulo.innerText = "Editar Empresa";
        btnSubmit.innerText = "Atualizar Dados";
        inputId.disabled = true; // Não pode mudar ID

        // Preencher campos
        inputId.value = empresaParaEditar.id;
        document.getElementById('input-nome-empresa').value = empresaParaEditar.nome;
        document.getElementById('input-sub-empresa').value = empresaParaEditar.subdominio;
        document.getElementById('input-data-empresa').value = empresaParaEditar.data_entrada;
        document.getElementById('input-obs-empresa').value = empresaParaEditar.obs;
    } else {
        // MODO NOVO
        modoEdicao.value = 'false';
        titulo.innerText = "Nova Empresa";
        btnSubmit.innerText = "Salvar Empresa";
        inputId.disabled = false;
    }

    // Animação de Abrir
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        const content = modal.querySelector('#modal-content-empresa');
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100');
    }, 10);
}