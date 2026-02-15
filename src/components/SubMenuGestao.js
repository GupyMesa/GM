// src/components/SubMenuGestao.js

export const renderSubMenuGestao = (containerId, props) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { moduloAtivo, onTrocarModulo, onAddSingle, onAddMass } = props;

    // Novas Abas conforme solicitado
    const abas = [
        { id: 'usuarios', label: 'Equipe' },
        { id: 'empresas', label: 'Empresas' },
        { id: 'gestoras', label: 'Gestoras' },
        { id: 'auditoras', label: 'Auditoras' }
    ];

    const html = `
        <div class="glass-submenu">
            <div class="submenu-tabs">
                ${abas.map(aba => `
                    <button class="tab-item ${moduloAtivo === aba.id ? 'active' : ''}" data-id="${aba.id}">
                        ${aba.label}
                    </button>
                `).join('')}
            </div>
            
            <div class="submenu-actions">
                <button id="btnAddMass" class="btn-action secondary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>Importar</span>
                </button>

                <button id="btnAddSingle" class="btn-action primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>Novo</span>
                </button>
            </div>
        </div>

        <style>
            .glass-submenu {
                display: flex; justify-content: space-between; align-items: center;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 16px; padding: 10px 20px;
                backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            }

            .submenu-tabs { display: flex; gap: 5px; background: rgba(0,0,0,0.2); padding: 5px; border-radius: 12px; overflow-x: auto; }
            
            .tab-item {
                background: transparent; border: none; color: rgba(255,255,255,0.6);
                padding: 8px 16px; border-radius: 8px; font-weight: 500; cursor: pointer;
                transition: all 0.2s; font-size: 0.9rem; white-space: nowrap;
            }
            .tab-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
            .tab-item.active { background: #fff; color: #000; font-weight: 600; box-shadow: 0 2px 10px rgba(0,0,0,0.2); }

            .submenu-actions { display: flex; align-items: center; gap: 10px; }

            .btn-action {
                display: flex; align-items: center; gap: 8px;
                padding: 8px 16px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s;
            }
            .btn-action.secondary { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); }
            .btn-action.secondary:hover { background: rgba(255,255,255,0.1); }
            .btn-action.primary { background: #fff; color: #000; }
            .btn-action.primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(255,255,255,0.15); }
            
            @media (max-width: 768px) {
                .glass-submenu { flex-direction: column; gap: 15px; align-items: stretch; }
                .submenu-actions { justify-content: flex-end; }
            }
        </style>
    `;

    container.innerHTML = html;

    container.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', () => onTrocarModulo(tab.dataset.id));
    });

    document.getElementById('btnAddSingle').addEventListener('click', onAddSingle);
    document.getElementById('btnAddMass').addEventListener('click', onAddMass);
};