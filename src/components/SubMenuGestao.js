// src/components/SubMenuGestao.js

export const renderSubMenuGestao = (containerId, actions) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const html = `
        <div class="glass-submenu">
            <div class="submenu-left">
                <h2 class="page-title">Painel de Controle</h2>
            </div>
            
            <div class="submenu-right">
                <button id="btnFullscreen" class="btn-icon" title="Tela Cheia">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                    </svg>
                </button>
                
                <div class="divider"></div>

                <button id="btnAddMass" class="btn-secondary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Importar CSV
                </button>

                <button id="btnAddSingle" class="btn-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Novo Usuário
                </button>
            </div>
        </div>

        <style>
            .glass-submenu {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 20px;
                padding: 15px 25px;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }

            .page-title { font-size: 1.2rem; font-weight: 700; margin: 0; letter-spacing: -0.5px; }

            .submenu-right { display: flex; align-items: center; gap: 12px; }

            .divider { width: 1px; height: 24px; background: rgba(255,255,255,0.1); margin: 0 5px; }

            .btn-icon {
                background: transparent; border: none; color: rgba(255,255,255,0.7);
                cursor: pointer; padding: 8px; border-radius: 10px; transition: all 0.2s;
            }
            .btn-icon:hover { background: rgba(255,255,255,0.1); color: #fff; }

            .btn-secondary {
                background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                color: #fff; padding: 10px 18px; border-radius: 12px; font-weight: 500; font-size: 0.9rem;
                cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;
            }
            .btn-secondary:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); }

            .btn-primary {
                background: #fff; border: none; color: #000;
                padding: 10px 20px; border-radius: 12px; font-weight: 700; font-size: 0.9rem;
                cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;
            }
            .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 5px 15px rgba(255,255,255,0.15); }
        </style>
    `;

    container.innerHTML = html;

    // Ações dos Botões
    document.getElementById('btnAddSingle').addEventListener('click', actions.onAddSingle);
    document.getElementById('btnAddMass').addEventListener('click', actions.onAddMass);
    document.getElementById('btnFullscreen').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    });
};