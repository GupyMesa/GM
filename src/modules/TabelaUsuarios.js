// src/modules/TabelaUsuarios.js

export const renderTabelaUsuarios = (containerId, usuarios) => {
    const container = document.getElementById(containerId);
    
    if (usuarios.length === 0) {
        container.innerHTML = `
            <div class="glass-container-table empty">
                <p>Nenhum assistente encontrado com os filtros selecionados.</p>
            </div>
            <style>.glass-container-table.empty { padding: 40px; text-align: center; color: rgba(255,255,255,0.5); }</style>
        `;
        return;
    }

    const html = `
        <div class="table-info">Exibindo ${usuarios.length} registros</div>
        <div class="glass-container-table">
            <div class="table-scroll">
                <table class="glass-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome do Assistente</th>
                            <th>Cargo / Função</th>
                            <th>Contrato</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${usuarios.map(u => `
                            <tr>
                                <td class="col-id">#${u.id}</td>
                                <td class="col-name">${u.nome}</td>
                                <td><span class="role-badge">${u.cargo || '-'}</span></td>
                                <td><span class="contract-badge">${u.contrato || 'CLT'}</span></td>
                                <td>
                                    <span class="status-dot ${(u.status || 'ATIVO') === 'ATIVO' ? 'online' : 'offline'}"></span> 
                                    ${u.status || 'ATIVO'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <style>
            .table-info { font-size: 0.8rem; color: rgba(255,255,255,0.4); margin-bottom: 10px; margin-left: 5px; }
            
            .glass-container-table {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 20px; padding: 20px;
                animation: fadeIn 0.3s ease-out;
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

            .table-scroll { overflow-x: auto; }
            .glass-table { width: 100%; border-collapse: collapse; min-width: 600px; }
            
            .glass-table th { text-align: left; padding: 15px; color: rgba(255,255,255,0.4); font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.1); }
            .glass-table td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.9rem; }
            .glass-table tr:hover { background: rgba(255,255,255,0.02); }

            .col-id { font-family: monospace; color: rgba(255,255,255,0.3); }
            .col-name { font-weight: 600; color: #fff; }
            
            .role-badge { background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; }
            .contract-badge { border: 1px solid rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; color: rgba(255,255,255,0.7); }
            
            .status-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; margin-right: 6px; }
            .status-dot.online { background: #32d74b; box-shadow: 0 0 5px #32d74b; }
            .status-dot.offline { background: #ff453a; }
        </style>
    `;
    container.innerHTML = html;
};