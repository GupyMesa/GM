// src/modules/TabelaUsuarios.js

export const renderTabelaUsuarios = (containerId, usuarios) => {
    const container = document.getElementById(containerId);
    
    // Removemos o margin-top excessivo pois agora ele vive dentro de um container organizado
    const html = `
        <div class="glass-container-table">
            <div class="table-scroll">
                <table class="glass-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome do Assistente</th>
                            <th>Cargo / Função</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${usuarios.map(u => `
                            <tr>
                                <td class="col-id">#${u.id}</td>
                                <td class="col-name">${u.nome}</td>
                                <td><span class="role-badge">${u.cargo}</span></td>
                                <td><span class="status-dot online"></span> Ativo</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <style>
            .glass-container-table {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 20px;
                padding: 20px;
                animation: slideUp 0.5s ease-out;
            }
            @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

            .table-scroll { overflow-x: auto; }
            .glass-table { width: 100%; border-collapse: collapse; min-width: 600px; }
            
            .glass-table th { 
                text-align: left; padding: 15px; color: rgba(255,255,255,0.4); 
                font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.1); 
            }
            .glass-table td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.9rem; }
            .glass-table tr:hover { background: rgba(255,255,255,0.02); }

            .col-id { font-family: monospace; color: rgba(255,255,255,0.3); }
            .col-name { font-weight: 600; color: #fff; }
            .role-badge { background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; }
            .status-dot { width: 6px; height: 6px; background: #32d74b; border-radius: 50%; display: inline-block; margin-right: 6px; }
        </style>
    `;
    container.innerHTML = html;
};