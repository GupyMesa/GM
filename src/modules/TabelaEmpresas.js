// src/modules/TabelaEmpresas.js

export const renderTabelaEmpresas = (containerId, empresas) => {
    const container = document.getElementById(containerId);
    
    const html = `
        <div class="glass-container-table">
            <div class="table-scroll">
                <table class="glass-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome da Empresa</th>
                            <th>Responsável</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${empresas.map(emp => `
                            <tr>
                                <td class="col-id">#${emp.id || '-'}</td>
                                <td class="col-name">${emp.nome || 'Sem Nome'}</td>
                                <td>${emp.responsavel || '-'}</td>
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
            .glass-table td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.9rem; color: rgba(255,255,255,0.8); }
            .glass-table tr:hover { background: rgba(255,255,255,0.02); }

            .col-id { font-family: monospace; color: rgba(255,255,255,0.3); }
            .col-name { font-weight: 600; color: #fff; }
            .status-dot { width: 6px; height: 6px; background: #32d74b; border-radius: 50%; display: inline-block; margin-right: 6px; }
        </style>
    `;
    container.innerHTML = html;
};