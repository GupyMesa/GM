// src/components/FiltrosEquipe.js

export const renderFiltrosEquipe = (containerId, opcoes, onFiltrar) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Extrai as opções únicas ou usa padrões se não tiver dados ainda
    const contratos = opcoes.contratos || ['CLT', 'PJ'];
    const funcoes = opcoes.funcoes || ['ASSISTENTE', 'AUDITORA', 'GESTORA'];
    const status = opcoes.status || ['ATIVO', 'INATIVO'];

    const html = `
        <div class="glass-filters">
            <div class="filter-group">
                <label>Contrato</label>
                <select id="filtro-contrato">
                    <option value="">Todos</option>
                    ${contratos.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
            </div>

            <div class="filter-group">
                <label>Função</label>
                <select id="filtro-funcao">
                    <option value="">Todas</option>
                    ${funcoes.map(f => `<option value="${f}">${f}</option>`).join('')}
                </select>
            </div>

            <div class="filter-group">
                <label>Status</label>
                <select id="filtro-status">
                    <option value="ATIVO" selected>Ativos</option>
                    <option value="INATIVO">Inativos</option>
                    <option value="">Todos</option>
                </select>
            </div>

            <div class="filter-search">
                <input type="text" id="filtro-busca" placeholder="Buscar por nome ou ID...">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </div>
        </div>

        <style>
            .glass-filters {
                display: flex; gap: 15px; align-items: flex-end;
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 16px; padding: 15px 20px;
                margin-bottom: 20px; flex-wrap: wrap;
            }

            .filter-group { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 150px; }
            .filter-group label { font-size: 0.75rem; color: rgba(255,255,255,0.6); font-weight: 600; text-transform: uppercase; }
            
            select {
                width: 100%; padding: 10px 15px; border-radius: 10px;
                background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                color: #fff; cursor: pointer; transition: all 0.2s; outline: none;
            }
            select:hover { background: rgba(255,255,255,0.1); }
            select option { background: #1a1a1a; color: #fff; }

            .filter-search { 
                position: relative; flex: 2; min-width: 250px; 
            }
            .filter-search input {
                width: 100%; padding: 10px 15px 10px 40px; border-radius: 10px;
                background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                color: #fff; outline: none; box-sizing: border-box;
            }
            .filter-search svg {
                position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
                color: rgba(255,255,255,0.4); pointer-events: none;
            }
            
            @media (max-width: 768px) {
                .glass-filters { flex-direction: column; align-items: stretch; }
                .filter-search { width: 100%; }
            }
        </style>
    `;

    container.innerHTML = html;

    // Lógica de Eventos
    const inputs = ['filtro-contrato', 'filtro-funcao', 'filtro-status', 'filtro-busca'];
    const getValores = () => ({
        contrato: document.getElementById('filtro-contrato').value,
        funcao: document.getElementById('filtro-funcao').value,
        status: document.getElementById('filtro-status').value,
        busca: document.getElementById('filtro-busca').value.toLowerCase()
    });

    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            onFiltrar(getValores());
        });
    });
};