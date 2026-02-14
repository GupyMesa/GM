export function CardKPI(titulo, valor, subtexto, tendencia = 0) {
    const corTendencia = tendencia >= 0 ? 'text-emerald-500' : 'text-rose-500';
    const iconeTendencia = tendencia >= 0 ? '↑' : '↓';

    return `
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider">${titulo}</p>
            <div class="flex items-end justify-between mt-2">
                <h3 class="text-3xl font-black text-slate-900">${valor}</h3>
                <span class="${corTendencia} text-sm font-bold bg-slate-50 px-2 py-1 rounded-lg">
                    ${iconeTendencia} ${Math.abs(tendencia)}%
                </span>
            </div>
            <p class="text-xs text-slate-400 mt-4 border-t pt-2">${subtexto}</p>
        </div>
    `;
}