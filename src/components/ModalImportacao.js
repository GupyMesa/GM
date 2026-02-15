// src/components/ModalImportacao.js

export const ModalImportacao = {
    render(containerId) {
        const container = document.getElementById(containerId);
        let modal = document.getElementById('modal-importacao');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-importacao';
            modal.className = 'glass-modal-overlay hidden';
            
            modal.innerHTML = `
                <div class="glass-modal">
                    <div class="modal-header">
                        <h3>Importar em Massa (CSV)</h3>
                        <button class="btn-close">&times;</button>
                    </div>
                    <div class="upload-area">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <p>Arraste seu arquivo aqui ou clique para selecionar</p>
                        <input type="file" accept=".csv" hidden>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-cancel">Cancelar</button>
                    </div>
                </div>
                <style>
                    /* Reutiliza estilos do modal anterior */
                    .upload-area {
                        border: 2px dashed rgba(255,255,255,0.1); border-radius: 16px;
                        padding: 40px; text-align: center; cursor: pointer; transition: all 0.2s;
                    }
                    .upload-area:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.02); }
                    .upload-area p { color: rgba(255,255,255,0.5); font-size: 0.9rem; margin-top: 15px; }
                </style>
            `;
            container.appendChild(modal);

            const close = () => modal.classList.remove('visible');
            modal.querySelector('.btn-close').addEventListener('click', close);
            modal.querySelector('.btn-cancel').addEventListener('click', close);
            
            const uploadArea = modal.querySelector('.upload-area');
            uploadArea.addEventListener('click', () => modal.querySelector('input').click());
            modal.querySelector('input').addEventListener('change', () => {
                alert('Arquivo selecionado! Processamento em breve.');
                close();
            });
        }

        requestAnimationFrame(() => {
            document.getElementById('modal-importacao').classList.add('visible');
        });
    }
};