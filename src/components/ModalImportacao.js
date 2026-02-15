// src/components/ModalImportacao.js

export const ModalImportacao = {
    render(containerId) {
        const container = document.getElementById(containerId);
        // Remove modal anterior se existir para evitar duplicação de eventos
        const oldModal = document.getElementById('modal-importacao');
        if (oldModal) oldModal.remove();

        const modal = document.createElement('div');
        modal.id = 'modal-importacao';
        modal.className = 'glass-modal-overlay hidden';
        
        modal.innerHTML = `
            <div class="glass-modal">
                <div class="modal-header">
                    <h3>Importar Equipe (CSV)</h3>
                    <button class="btn-close">&times;</button>
                </div>
                <div class="upload-area" id="drop-area">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p>Clique para selecionar o arquivo <b>.csv</b></p>
                    <p class="file-name" style="color:#32d74b; font-size:0.8rem; margin-top:5px; min-height:1rem"></p>
                    <input type="file" accept=".csv" hidden>
                </div>
                
                <div class="status-box" style="display:none; margin-top:15px; font-size:0.85rem; color:#fff; background:rgba(255,255,255,0.1); padding:10px; border-radius:8px;"></div>

                <div class="modal-actions">
                    <button class="btn-cancel">Cancelar</button>
                    <button class="btn-importar" disabled>Importar Agora</button>
                </div>
            </div>
            
            <style>
                .upload-area { border: 2px dashed rgba(255,255,255,0.1); border-radius: 16px; padding: 30px; text-align: center; cursor: pointer; transition: all 0.2s; }
                .upload-area:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.02); }
                .glass-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 10000; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
                .glass-modal-overlay.visible { opacity: 1; pointer-events: auto; }
                .glass-modal { background: #151515; border: 1px solid rgba(255,255,255,0.1); padding: 30px; border-radius: 24px; width: 400px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); }
                .modal-header { display: flex; justify-content: space-between; margin-bottom: 20px; color:#fff; }
                .btn-close { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
                .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 25px; }
                .btn-cancel { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 10px 20px; border-radius: 12px; cursor: pointer; }
                .btn-importar { background: #fff; border: none; color: #000; padding: 10px 20px; border-radius: 12px; font-weight: bold; cursor: pointer; opacity: 0.5; pointer-events: none; }
                .btn-importar:not([disabled]) { opacity: 1; pointer-events: auto; }
            </style>
        `;
        container.appendChild(modal);

        const dropArea = modal.querySelector('#drop-area');
        const fileInput = modal.querySelector('input[type="file"]');
        const fileNameDisplay = modal.querySelector('.file-name');
        const btnImportar = modal.querySelector('.btn-importar');
        const statusBox = modal.querySelector('.status-box');
        let fileToUpload = null;

        const close = () => modal.classList.remove('visible');

        modal.querySelector('.btn-close').addEventListener('click', close);
        modal.querySelector('.btn-cancel').addEventListener('click', close);
        dropArea.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                fileToUpload = e.target.files[0];
                fileNameDisplay.textContent = fileToUpload.name;
                btnImportar.removeAttribute('disabled');
            }
        });

        btnImportar.addEventListener('click', async () => {
            if (!fileToUpload) return;

            btnImportar.textContent = 'Processando...';
            btnImportar.setAttribute('disabled', true);
            statusBox.style.display = 'block';
            statusBox.textContent = 'Lendo arquivo...';

            try {
                const text = await fileToUpload.text();
                const lines = text.split('\n');
                const novosUsuarios = [];
                const idsVistos = new Set();

                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    // Tratamento simples de CSV (atenção com vírgulas dentro de campos)
                    const cols = line.split(',');
                    
                    if (cols.length >= 1) {
                        // Tenta extrair ID
                        const idStr = cols[0].replace(/[^0-9]/g, '');
                        if (!idStr) continue;
                        
                        const id = parseInt(idStr);
                        
                        // Validação para evitar duplicados no próprio CSV
                        if (!isNaN(id) && !idsVistos.has(id)) {
                            novosUsuarios.push({
                                id: id,
                                nome: (cols[1] || 'Sem Nome').trim(),
                                contrato: (cols[2] || 'CLT').trim(),
                                status: (cols[3] || 'ATIVO').trim(),
                                cargo: (cols[4] || 'ASSISTENTE').trim(),
                                senha: 'gupy123'
                            });
                            idsVistos.add(id);
                        }
                    }
                }

                if (novosUsuarios.length === 0) {
                    throw new Error("Não foi possível ler nenhum usuário válido no CSV.");
                }

                statusBox.textContent = `Enviando ${novosUsuarios.length} registros...`;

                const response = await fetch('/api/usuarios/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novosUsuarios)
                });

                const result = await response.json();
                
                if (response.ok) {
                    statusBox.style.color = '#32d74b';
                    statusBox.textContent = result.mensagem;
                    setTimeout(() => {
                        close();
                        // Força atualização da lista de usuários sem recarregar a página toda
                        if (window.UsuariosModule) {
                            window.UsuariosModule.init('conteudo-principal'); // Reutiliza init
                        } else {
                            window.location.reload();
                        }
                    }, 2000);
                } else {
                    throw new Error(result.mensagem || 'Erro desconhecido no servidor');
                }

            } catch (error) {
                console.error("Erro na importação:", error);
                statusBox.style.color = '#ff453a';
                statusBox.textContent = error.message;
                btnImportar.textContent = 'Tentar Novamente';
                btnImportar.removeAttribute('disabled');
            }
        });

        requestAnimationFrame(() => {
            modal.classList.add('visible');
        });
    }
};