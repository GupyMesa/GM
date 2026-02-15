// src/components/ModalNovoUsuario.js

export const ModalNovoUsuario = {
    render(containerId) {
        const container = document.getElementById(containerId);
        // Cria o elemento do modal se não existir
        let modal = document.getElementById('modal-novo-usuario');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-novo-usuario';
            modal.className = 'glass-modal-overlay hidden';
            
            modal.innerHTML = `
                <div class="glass-modal">
                    <div class="modal-header">
                        <h3>Novo Assistente</h3>
                        <button class="btn-close">&times;</button>
                    </div>
                    <form id="formNovoUsuario">
                        <div class="form-group">
                            <label>Nome Completo</label>
                            <input type="text" placeholder="Ex: Ana Silva" required>
                        </div>
                        <div class="form-group">
                            <label>ID do Sistema</label>
                            <input type="number" placeholder="Ex: 102030" required>
                        </div>
                        <div class="form-group">
                            <label>Cargo / Função</label>
                            <select>
                                <option value="ASSISTENTE">Assistente</option>
                                <option value="AUDITORA">Auditora</option>
                                <option value="GESTORA">Gestora</option>
                            </select>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn-cancel">Cancelar</button>
                            <button type="submit" class="btn-save">Salvar</button>
                        </div>
                    </form>
                </div>
                <style>
                    .glass-modal-overlay {
                        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                        background: rgba(0,0,0,0.6); backdrop-filter: blur(5px);
                        display: flex; justify-content: center; align-items: center; z-index: 10000;
                        opacity: 0; pointer-events: none; transition: opacity 0.3s;
                    }
                    .glass-modal-overlay.visible { opacity: 1; pointer-events: auto; }
                    
                    .glass-modal {
                        background: #151515; border: 1px solid rgba(255,255,255,0.1);
                        padding: 30px; border-radius: 24px; width: 400px;
                        box-shadow: 0 25px 50px rgba(0,0,0,0.5);
                        transform: scale(0.95); transition: transform 0.3s;
                    }
                    .glass-modal-overlay.visible .glass-modal { transform: scale(1); }

                    .modal-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                    .modal-header h3 { margin: 0; font-size: 1.2rem; }
                    .btn-close { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }

                    .form-group { margin-bottom: 15px; }
                    .form-group label { display: block; font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-bottom: 5px; }
                    .form-group input, .form-group select {
                        width: 100%; padding: 12px; border-radius: 12px;
                        background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                        color: #fff; box-sizing: border-box;
                    }

                    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 25px; }
                    .btn-cancel { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 10px 20px; border-radius: 12px; cursor: pointer; }
                    .btn-save { background: #fff; border: none; color: #000; padding: 10px 20px; border-radius: 12px; font-weight: bold; cursor: pointer; }
                </style>
            `;
            
            container.appendChild(modal);

            // Eventos
            const close = () => modal.classList.remove('visible');
            modal.querySelector('.btn-close').addEventListener('click', close);
            modal.querySelector('.btn-cancel').addEventListener('click', close);
            modal.querySelector('#formNovoUsuario').addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Funcionalidade de salvar em desenvolvimento (API)!');
                close();
            });
        }
        
        // Abre o modal
        requestAnimationFrame(() => {
            document.getElementById('modal-novo-usuario').classList.add('visible');
        });
    }
};