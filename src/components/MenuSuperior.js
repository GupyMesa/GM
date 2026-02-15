// src/components/MenuSuperior.js
import { AuthEngine } from '../engines/AuthEngine.js';

export const renderMenuSuperior = (containerId) => {
    // Verifica acesso antes de renderizar
    const user = AuthEngine.checkAccess();
    if (!user) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    // Design Glassmorphism 2026
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
                    <button id="btnLogout" class="btn-logout" title="Sair do Sistema">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
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
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 24px;
                padding: 12px 25px;
                z-index: 9999;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            }

            .nav-content { display: flex; justify-content: space-between; align-items: center; }
            .nav-brand { display: flex; align-items: center; gap: 12px; }
            .nav-logo { height: 32px; filter: brightness(0) invert(1); }
            .brand-name { font-weight: 800; font-size: 1.1rem; color: #fff; letter-spacing: -0.5px; }

            .nav-links { display: flex; gap: 8px; }
            .nav-item {
                color: rgba(255, 255, 255, 0.6);
                text-decoration: none;
                font-weight: 500;
                font-size: 0.9rem;
                padding: 10px 18px;
                border-radius: 14px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .nav-item:hover, .nav-item.active {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
            }

            .nav-user { display: flex; align-items: center; gap: 20px; }
            .user-info { text-align: right; }
            .user-name { display: block; font-weight: 600; color: #fff; font-size: 0.85rem; }
            .user-role { font-size: 0.7rem; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; }

            .btn-logout {
                background: rgba(255, 69, 58, 0.1);
                border: 1px solid rgba(255, 69, 58, 0.2);
                color: #ff453a;
                padding: 10px;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex; align-items: center; justify-content: center;
            }
            .btn-logout:hover {
                background: #ff453a; color: #fff; transform: translateY(-2px);
            }
        </style>
    `;

    container.innerHTML = html;

    // Event Listeners
    document.getElementById('btnLogout').addEventListener('click', () => {
        AuthEngine.logout();
    });
};