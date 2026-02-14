import { UsuariosModule } from '../modules/UsuariosModule.js';

export function abrirModalImportacao() {
    let modal = document.getElementById('modal-importacao');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-importacao';
        modal.className = 'fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm hidden';
        
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 transform scale-100">
                <div class="text-center mb-6">
                    <div class="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </div>
                    <h3 class="text-2xl font-black text-slate-800">Importar CSV</h3>
                    <p class="text-sm text-slate-500 mt-2">Selecione o arquivo <code class="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">Usuarios.csv</code></p>
                </div>

                <div class="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition cursor-pointer relative" id="drop-zone">
                    <input type="file" id="input-csv" accept=".csv" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                    <p class="text-sm text-slate-500 font-bold" id="nome-arquivo">Clique para selecionar ou arraste aqui</p>
                </div>

                <div class="mt-6 flex gap-3">
                    <button id="btn-cancelar-import" class="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Cancelar</button>
                    <button id="btn-confirmar-import" class="flex-1 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-lg shadow-indigo-500/20 opacity-50 cursor-not-allowed" disabled>
                        Processar
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Elementos
        const input = document.getElementById('input-csv');
        const nomeArquivo = document.getElementById('nome-arquivo');
        const btnConfirmar = document.getElementById('btn-confirmar-import');
        const btnCancelar = document.getElementById('btn-cancelar-import');
        const dropZone = document.getElementById('drop-zone');

        // Feedback Visual de Seleção
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

        // Ação de Importar
        btnConfirmar.addEventListener('click', () => {
            const file = input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const texto = e.target.result;
                try {
                    const resultado = UsuariosModule.processarCSV(texto);
                    alert(`✅ Sucesso!\n${resultado.total} usuários processados.\n(Erros ignorados: ${resultado.erros})`);
                    modal.classList.add('hidden');
                } catch (erro) {
                    alert('Erro ao processar CSV: ' + erro.message);
                }
            };
            reader.readAsText(file); // Lê o arquivo como texto puro
        });

        btnCancelar.addEventListener('click', () => modal.classList.add('hidden'));
    }

    modal.classList.remove('hidden');
}