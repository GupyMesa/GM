// src/components/MenuSuperior.js
import AuthEngine from '../engines/AuthEngine.js';

export const renderMenuSuperior = (containerId) => {
    const user = AuthEngine.checkAccess();
    const container = document.getElementById(containerId);

    const html = `
        <nav class="glass-nav">
            <div class="nav-content">
                <div class="nav-brand">
                    <img src="/assets/img/logo.png" alt="GupyMesa" class="nav-logo">
                    <span class="brand-name">GupyMesa</span>
                </div>
                
                <div class="nav-links">
                    <a href="/public/gestao.html" class="nav-item active">Gestão</a>
                    <a href="#" class="nav-item">Empresas</a>
                    <a href="#" class="nav-item">Relatórios</a>
                </div>

                <div class="nav-user">
                    <div class="user-info">
                        <span class="user-name">${user.nome}</span>
                        <span class="user-role">${user.cargo}</span>
                    </div>
                    <button id="btnLogout" class="btn-logout" title="Sair">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>

        <style>
            .glass-nav {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 95%;
                max-width: 1200px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 20px;
                padding: 10px 25px;
                z-index: 1000;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }

            .nav-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .nav-brand {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .nav-logo { height: 35px; }
            .brand-name { font-weight: 700; font-size: 1.2rem; color: #fff; }

            .nav-links { display: flex; gap: 20px; }
            .nav-item {
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
                font-weight: 500;
                padding: 8px 15px;
                border-radius: 10px;
                transition: all 0.3s ease;
            }

            .nav-item:hover, .nav-item.active {
                background: rgba(255, 255, 255, 0.15);
                color: #fff;
            }

            .nav-user { display: flex; align-items: center; gap: 15px; }
            .user-info { text-align: right; }
            .user-name { display: block; font-weight: 600; color: #fff; font-size: 0.9rem; }
            .user-role { font-size: 0.75rem; color: rgba(255, 255, 255, 0.6); }

            .btn-logout {
                background: rgba(255, 59, 48, 0.2);
                border: 1px solid rgba(255, 59, 48, 0.3);
                color: #ff453a;
                padding: 10px;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .btn-logout:hover {
                background: #ff453a;
                color: #fff;
                transform: scale(1.05);
            }
        </style>
    `;

    container.innerHTML = html;

    document.getElementById('btnLogout').addEventListener('click', () => {
        AuthEngine.logout();
    });
};