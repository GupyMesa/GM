import { EmpresasModule } from '../modules/EmpresasModule.js';

export function abrirModalImportacaoEmpresas() {
    let modal = document.getElementById('modal-importacao-empresas');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-importacao-empresas';
        modal.className = 'fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm hidden';
        
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 transform scale-100">
                <div class="text-center mb-6">
                    <div class="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </div>
                    <h3 class="text-2xl font-black text-slate-800">Importar Empresas</h3>
                    <p class="text-sm text-slate-500 mt-2">Arquivo CSV separado por <strong class="bg-slate-100 px-1 rounded text-indigo-600">ponto e vírgula (;)</strong></p>
                </div>

                <div class="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition cursor-pointer relative" id="drop-zone-empresa">
                    <input type="file" id="input-csv-empresa" accept=".csv" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                    <p class="text-sm text-slate-500 font-bold" id="nome-arquivo-empresa">Clique para selecionar Empresas.csv</p>
                </div>

                <div class="mt-6 flex gap-3">
                    <button id="btn-cancelar-empresa" class="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Cancelar</button>
                    <button id="btn-confirmar-empresa" class="flex-1 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-lg shadow-indigo-500/20 opacity-50 cursor-not-allowed" disabled>
                        Processar
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const input = document.getElementById('input-csv-empresa');
        const nomeArquivo = document.getElementById('nome-arquivo-empresa');
        const btnConfirmar = document.getElementById('btn-confirmar-empresa');
        const btnCancelar = document.getElementById('btn-cancelar-empresa');
        const dropZone = document.getElementById('drop-zone-empresa');

        input.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                nomeArquivo.innerText = `📄 ${file.name}`;
                nomeArquivo.classList.add('text-indigo-600');
                dropZone.classList.add('border-indigo-500', 'bg-indigo-50');
                btnConfirmar.disabled = false;
                btnConfirmar.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        });

        btnConfirmar.addEventListener('click', () => {
            const file = input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const texto = e.target.result;
                try {
                    const res = EmpresasModule.processarCSV(texto);
                    alert(`✅ Sucesso!\n${res.total} empresas importadas.`);
                    modal.classList.add('hidden');
                } catch (erro) {
                    alert('Erro ao processar CSV: ' + erro.message);
                }
            };
            reader.readAsText(file);
        });

        btnCancelar.addEventListener('click', () => modal.classList.add('hidden'));
    }

    modal.classList.remove('hidden');
}