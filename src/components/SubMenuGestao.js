// src/components/SubMenuGestao.js

export const renderSubMenuGestao = (containerId, props) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { moduloAtivo, onTrocarModulo, onAddSingle, onAddMass, filtrosConfig } = props;

    const abas = [
        { id: 'usuarios', label: 'Equipe' },
        { id: 'empresas', label: 'Empresas' },
        { id: 'gestoras', label: 'Gestoras' },
        { id: 'auditoras', label: 'Auditoras' }
    ];

    let html = `
        <div class="glass-submenu">
            <div class="submenu-left">
                <div class="submenu-tabs">
                    ${abas.map(aba => `
                        <button class="tab-item ${moduloAtivo === aba.id ? 'active' : ''}" data-id="${aba.id}">
                            ${aba.label}
                        </button>
                    `).join('')}
                </div>
            </div>

            ${filtrosConfig ? `
                <div class="submenu-center filters-minimal">
                    <div class="search-capsule">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" id="globalSearch" placeholder="Buscar..." value="${filtrosConfig.valoresAtuais?.busca || ''}">
                    </div>

                    <div class="divider-small"></div>

                    <div class="select-group">
                        <select id="filterContrato" class="select-capsule" title="Filtrar Contrato">
                            <option value="">Contrato: Todos</option>
                            ${filtrosConfig.opcoes.contratos.map(c => `<option value="${c}" ${filtrosConfig.valoresAtuais.contrato === c ? 'selected' : ''}>${c}</option>`).join('')}
                        </select>

                        <select id="filterFuncao" class="select-capsule" title="Filtrar Função">
                            <option value="">Função: Todas</option>
                            ${filtrosConfig.opcoes.funcoes.map(f => `<option value="${f}" ${filtrosConfig.valoresAtuais.funcao === f ? 'selected' : ''}>${f}</option>`).join('')}
                        </select>

                        <select id="filterStatus" class="select-capsule" title="Filtrar Status">
                            <option value="">Status: Todos</option>
                            <option value="ATIVO" ${filtrosConfig.valoresAtuais.status === 'ATIVO' ? 'selected' : ''}>Ativo</option>
                            <option value="INATIVO" ${filtrosConfig.valoresAtuais.status === 'INATIVO' ? 'selected' : ''}>Inativo</option>
                        </select>
                    </div>
                </div>
            ` : '<div class="spacer"></div>'}
            
            <div class="submenu-right actions-group">
                <button id="btnAddMass" class="btn-icon-only" title="Importar">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </button>

                <button id="btnAddSingle" class="btn-primary-small">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    <span>Novo</span>
                </button>
            </div>
        </div>

        <style>
            .glass-submenu {
                display: flex; justify-content: space-between; align-items: center; gap: 20px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.06);
                border-radius: 14px; padding: 8px 12px;
                backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                height: 48px; /* Altura fixa para ser slim */
            }

            /* --- TABS --- */
            .submenu-tabs { display: flex; gap: 4px; }
            .tab-item {
                background: transparent; border: none; color: rgba(255,255,255,0.5);
                padding: 6px 12px; border-radius: 8px; cursor: pointer;
                transition: all 0.2s; font-size: 0.85rem; font-weight: 500;
            }
            .tab-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
            .tab-item.active { background: rgba(255,255,255,0.1); color: #fff; font-weight: 600; }

            /* --- FILTROS MINIMALISTAS --- */
            .submenu-center { display: flex; align-items: center; gap: 10px; flex: 1; justify-content: center; }
            
            .search-capsule {
                display: flex; align-items: center; gap: 8px;
                background: rgba(0,0,0,0.2); border-radius: 20px;
                padding: 4px 12px; height: 32px; width: 180px;
                border: 1px solid transparent; transition: all 0.2s;
            }
            .search-capsule:focus-within { border-color: rgba(255,255,255,0.1); background: rgba(0,0,0,0.4); width: 220px; }
            .search-capsule input { 
                background: none; border: none; color: #fff; font-size: 0.85rem; width: 100%; outline: none; 
            }
            .search-capsule svg { color: rgba(255,255,255,0.4); }

            .divider-small { width: 1px; height: 16px; background: rgba(255,255,255,0.1); }

            .select-group { display: flex; gap: 8px; }
            
            .select-capsule {
                appearance: none; -webkit-appearance: none;
                background: rgba(255,255,255,0.03); 
                border: 1px solid rgba(255,255,255,0.08);
                border-radius: 8px;
                padding: 0 24px 0 10px; /* Espaço p/ seta */
                height: 32px;
                color: rgba(255,255,255,0.7);
                font-size: 0.75rem; font-weight: 500;
                cursor: pointer; outline: none; transition: all 0.2s;
                
                /* Seta customizada via SVG encoded */
                background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                background-repeat: no-repeat;
                background-position: right 4px center;
                background-size: 14px;
                min-width: 100px;
            }
            .select-capsule:hover { background-color: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); color: #fff; }
            .select-capsule:focus { border-color: rgba(255,255,255,0.4); background-color: rgba(255,255,255,0.05); }
            
            .select-capsule option { background: #1a1a1a; color: #fff; }

            /* --- AÇÕES --- */
            .actions-group { display: flex; gap: 8px; }
            
            .btn-icon-only {
                background: transparent; border: 1px solid rgba(255,255,255,0.1);
                color: rgba(255,255,255,0.7); border-radius: 8px;
                width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: all 0.2s;
            }
            .btn-icon-only:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.3); }

            .btn-primary-small {
                background: #fff; border: none; color: #000;
                border-radius: 8px; padding: 0 14px; height: 32px;
                font-size: 0.8rem; font-weight: 700;
                display: flex; align-items: center; gap: 6px; cursor: pointer;
            }
            .btn-primary-small:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(255,255,255,0.15); }

            /* Responsividade */
            @media (max-width: 1024px) {
                .glass-submenu { height: auto; flex-wrap: wrap; padding: 12px; }
                .submenu-center { order: 3; width: 100%; justify-content: flex-start; margin-top: 10px; flex-wrap: wrap; }
                .search-capsule { width: 100%; max-width: none; }
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
        const emitir = () => {
            filtrosConfig.onFiltrar({
                busca: document.getElementById('globalSearch').value,
                contrato: document.getElementById('filterContrato').value,
                funcao: document.getElementById('filterFuncao').value,
                status: document.getElementById('filterStatus').value
            });
        };

        document.getElementById('globalSearch').addEventListener('input', emitir);
        document.getElementById('filterContrato').addEventListener('change', emitir);
        document.getElementById('filterFuncao').addEventListener('change', emitir);
        document.getElementById('filterStatus').addEventListener('change', emitir);
    }
};