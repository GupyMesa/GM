// src/components/SubMenuGestao.js

export const renderSubMenuGestao = (containerId, props) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { moduloAtivo, onTrocarModulo, onAddSingle, onAddMass, filtrosConfig } = props;

    // Abas de Navegação
    const abas = [
        { id: 'usuarios', label: 'Equipe' },
        { id: 'empresas', label: 'Empresas' },
        { id: 'gestoras', label: 'Gestoras' },
        { id: 'auditoras', label: 'Auditoras' }
    ];

    // HTML Principal
    let html = `
        <div class="glass-submenu-wrapper">
            <div class="glass-submenu">
                <div class="submenu-tabs">
                    ${abas.map(aba => `
                        <button class="tab-item ${moduloAtivo === aba.id ? 'active' : ''}" data-id="${aba.id}">
                            ${aba.label}
                        </button>
                    `).join('')}
                </div>
                
                <div class="submenu-actions">
                    ${filtrosConfig ? `
                        <div class="search-box">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="text" id="globalSearch" placeholder="Buscar..." value="${filtrosConfig.valoresAtuais?.busca || ''}">
                        </div>
                        
                        <button id="btnToggleFilters" class="btn-icon ${filtrosConfig.ativo ? 'active' : ''}" title="Filtros Avançados">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                        </button>
                        <div class="divider"></div>
                    ` : ''}

                    <button id="btnAddMass" class="btn-action secondary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        <span>Importar</span>
                    </button>

                    <button id="btnAddSingle" class="btn-action primary">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        <span>Novo</span>
                    </button>
                </div>
            </div>

            ${filtrosConfig ? `
                <div id="filterDrawer" class="filter-drawer ${filtrosConfig.aberto ? 'open' : ''}">
                    <div class="filter-grid">
                        <div class="filter-item">
                            <label>Contrato</label>
                            <select id="filterContrato">
                                <option value="">Todos</option>
                                ${filtrosConfig.opcoes.contratos.map(c => `<option value="${c}" ${filtrosConfig.valoresAtuais.contrato === c ? 'selected' : ''}>${c}</option>`).join('')}
                            </select>
                        </div>
                        <div class="filter-item">
                            <label>Função</label>
                            <select id="filterFuncao">
                                <option value="">Todas</option>
                                ${filtrosConfig.opcoes.funcoes.map(f => `<option value="${f}" ${filtrosConfig.valoresAtuais.funcao === f ? 'selected' : ''}>${f}</option>`).join('')}
                            </select>
                        </div>
                        <div class="filter-item">
                            <label>Status</label>
                            <select id="filterStatus">
                                <option value="">Todos</option>
                                <option value="ATIVO" ${filtrosConfig.valoresAtuais.status === 'ATIVO' ? 'selected' : ''}>Ativo</option>
                                <option value="INATIVO" ${filtrosConfig.valoresAtuais.status === 'INATIVO' ? 'selected' : ''}>Inativo</option>
                            </select>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>

        <style>
            .glass-submenu-wrapper { position: relative; z-index: 900; }
            
            .glass-submenu {
                display: flex; justify-content: space-between; align-items: center;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 16px; padding: 10px 20px;
                backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
                position: relative; z-index: 2;
            }

            .submenu-tabs { display: flex; gap: 5px; }
            .tab-item { background: transparent; border: none; color: rgba(255,255,255,0.6); padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; }
            .tab-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
            .tab-item.active { background: #fff; color: #000; font-weight: 600; }

            .submenu-actions { display: flex; align-items: center; gap: 12px; }
            
            /* Search Box Clean */
            .search-box {
                position: relative; display: flex; align-items: center;
                background: rgba(255,255,255,0.05); border-radius: 8px; padding: 0 10px;
                transition: all 0.2s; border: 1px solid transparent;
            }
            .search-box:focus-within { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
            .search-box svg { color: rgba(255,255,255,0.5); margin-right: 8px; }
            .search-box input {
                background: transparent; border: none; color: #fff; padding: 8px 0; outline: none; width: 150px; font-size: 0.9rem;
            }

            .btn-icon { background: transparent; border: none; color: rgba(255,255,255,0.6); cursor: pointer; padding: 8px; border-radius: 8px; transition: all 0.2s; }
            .btn-icon:hover { color: #fff; background: rgba(255,255,255,0.1); }
            .btn-icon.active { color: #fff; background: rgba(255,255,255,0.2); }

            .divider { width: 1px; height: 24px; background: rgba(255,255,255,0.1); }

            .btn-action { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer; border: none; }
            .btn-action.secondary { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); }
            .btn-action.primary { background: #fff; color: #000; }

            /* Filter Drawer */
            .filter-drawer {
                background: rgba(20, 20, 20, 0.95);
                border: 1px solid rgba(255,255,255,0.05);
                border-top: none;
                border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;
                padding: 0; max-height: 0; overflow: hidden; opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                margin-top: -10px; padding-top: 10px; /* Overlap visual */
                position: relative; z-index: 1;
            }
            .filter-drawer.open { max-height: 200px; opacity: 1; padding: 20px; margin-top: -5px; }

            .filter-grid { display: flex; gap: 20px; }
            .filter-item { flex: 1; display: flex; flex-direction: column; gap: 5px; }
            .filter-item label { font-size: 0.75rem; color: rgba(255,255,255,0.5); font-weight: 600; text-transform: uppercase; }
            .filter-item select {
                background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                color: #fff; padding: 8px; border-radius: 8px; outline: none;
            }
        </style>
    `;

    container.innerHTML = html;

    // --- EVENTOS ---
    container.querySelectorAll('.tab-item').forEach(tab => 
        tab.addEventListener('click', () => onTrocarModulo(tab.dataset.id))
    );
    document.getElementById('btnAddSingle').addEventListener('click', onAddSingle);
    document.getElementById('btnAddMass').addEventListener('click', onAddMass);

    if (filtrosConfig) {
        // Toggle Gaveta
        const btnToggle = document.getElementById('btnToggleFilters');
        const drawer = document.getElementById('filterDrawer');
        btnToggle.addEventListener('click', () => {
            const isOpen = drawer.classList.contains('open');
            drawer.classList.toggle('open');
            btnToggle.classList.toggle('active');
            filtrosConfig.onToggle(isOpen ? false : true); // Persiste estado
        });

        // Inputs
        const emitirFiltros = () => {
            filtrosConfig.onFiltrar({
                busca: document.getElementById('globalSearch').value,
                contrato: document.getElementById('filterContrato').value,
                funcao: document.getElementById('filterFuncao').value,
                status: document.getElementById('filterStatus').value
            });
        };

        document.getElementById('globalSearch').addEventListener('input', emitirFiltros);
        document.getElementById('filterContrato').addEventListener('change', emitirFiltros);
        document.getElementById('filterFuncao').addEventListener('change', emitirFiltros);
        document.getElementById('filterStatus').addEventListener('change', emitirFiltros);
    }
};