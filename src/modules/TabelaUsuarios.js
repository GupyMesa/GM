// src/modules/TabelaUsuarios.js
import { AuthEngine } from '../engines/AuthEngine.js';

/**
 * Renderiza a listagem de usuários com design Glassmorphism
 */
export const renderTabelaUsuarios = (containerId, usuarios) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const html = `
        <div class="glass-container">
            <div class="table-header">
                <div>
                    <h2 class="title-main">Gestão de Assistentes</h2>
                    <p class="subtitle">Equipe ativa no sistema</p>
                </div>
                <button class="btn-add-modern" onclick="alert('Funcionalidade em desenvolvimento')">
                    + Adicionar Novo
                </button>
            </div>
            
            <div class="table-scroll">
                <table class="glass-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome Completo</th>
                            <th>Função / Cargo</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${usuarios.map(u => `
                            <tr class="table-row">
                                <td class="col-id">#${u.id}</td>
                                <td class="col-name">${u.nome}</td>
                                <td><span class="role-badge">${u.cargo}</span></td>
                                <td>
                                    <div class="status-wrapper">
                                        <span class="status-dot online"></span>
                                        Ativo
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <style>
            .glass-container {
                background: rgba(255, 255, 255, 0.03);
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 30px;
                padding: 40px;
                margin: 120px auto 40px;
                width: 90%;
                max-width: 1100px;
                color: #ffffff;
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
            }

            .table-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 35px;
            }

            .title-main { font-size: 1.8rem; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
            .subtitle { color: rgba(255, 255, 255, 0.4); margin: 5px 0 0 0; font-size: 0.9rem; }

            .btn-add-modern {
                background: #ffffff;
                color: #000;
                border: none;
                padding: 12px 25px;
                border-radius: 15px;
                font-weight: 700;
                cursor: pointer;
                transition: transform 0.2s ease;
            }

            .btn-add-modern:hover { transform: scale(1.05); }

            .table-scroll { overflow-x: auto; }
            .glass-table { width: 100%; border-collapse: collapse; }

            .glass-table th {
                text-align: left;
                padding: 20px;
                color: rgba(255, 255, 255, 0.3);
                font-size: 0.8rem;
                text-transform: uppercase;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .table-row { transition: background 0.3s ease; }
            .table-row:hover { background: rgba(255, 255, 255, 0.03); }

            .glass-table td { padding: 22px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }

            .col-id { color: rgba(255, 255, 255, 0.2); font-family: 'Courier New', monospace; }
            .col-name { font-weight: 600; font-size: 1.05rem; }

            .role-badge {
                background: rgba(255, 255, 255, 0.07);
                padding: 6px 14px;
                border-radius: 12px;
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.8);
            }

            .status-wrapper { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; }
            .status-dot { width: 9px; height: 9px; border-radius: 50%; }
            .status-dot.online { background: #32d74b; box-shadow: 0 0 12px #32d74b; }
        </style>
    `;
    
    container.innerHTML = html;
};