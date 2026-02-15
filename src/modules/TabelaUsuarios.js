// src/modules/TabelaUsuarios.js
import { AuthEngine } from '../engines/AuthEngine.js';

/**
 * Renderiza a tabela de usuários com estilo Glassmorphism 2026
 */
export const renderTabelaUsuarios = (containerId, usuarios) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const html = `
        <div class="glass-container">
            <div class="table-header">
                <div>
                    <h2 class="title-main">Gestão de Assistentes</h2>
                    <p class="subtitle">Controle de produtividade e acesso</p>
                </div>
                <button class="btn-add-modern" onclick="alert('Funcionalidade em desenvolvimento')">
                    <span class="icon">+</span> Novo Usuário
                </button>
            </div>
            
            <div class="table-scroll">
                <table class="glass-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome do Assistente</th>
                            <th>Cargo / Função</th>
                            <th>Status</th>
                            <th>Ações</th>
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
                                <td>
                                    <button class="btn-edit-minimal">Editar</button>
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
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 30px;
                padding: 30px;
                margin: 120px auto 40px;
                width: 90%;
                max-width: 1100px;
                color: #ffffff;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
            }

            .table-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 30px;
            }

            .title-main { font-size: 1.8rem; font-weight: 700; margin: 0; letter-spacing: -0.5px; }
            .subtitle { color: rgba(255, 255, 255, 0.5); margin: 5px 0 0 0; font-size: 0.9rem; }

            .btn-add-modern {
                background: #ffffff;
                color: #000000;
                border: none;
                padding: 12px 24px;
                border-radius: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .btn-add-modern:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1); }

            .table-scroll { overflow-x: auto; }
            .glass-table { width: 100%; border-collapse: collapse; min-width: 700px; }

            .glass-table th {
                text-align: left;
                padding: 18px;
                color: rgba(255, 255, 255, 0.4);
                font-size: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .table-row { transition: background 0.2s ease; }
            .table-row:hover { background: rgba(255, 255, 255, 0.02); }

            .glass-table td { padding: 20px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }

            .col-id { color: rgba(255, 255, 255, 0.3); font-family: monospace; }
            .col-name { font-weight: 600; font-size: 1rem; }

            .role-badge {
                background: rgba(255, 255, 255, 0.08);
                padding: 6px 14px;
                border-radius: 12px;
                font-size: 0.8rem;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .status-wrapper { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; }
            .status-dot { width: 8px; height: 8px; border-radius: 50%; }
            .status-dot.online { background: #32d74b; box-shadow: 0 0 10px #32d74b; }

            .btn-edit-minimal {
                background: transparent;
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #fff;
                padding: 6px 12px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.8rem;
            }

            .btn-edit-minimal:hover { background: #fff; color: #000; }
        </style>
    `;
    
    container.innerHTML = html;
};