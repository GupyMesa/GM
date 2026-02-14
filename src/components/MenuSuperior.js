export function renderizarMenuSuperior(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Ajuste de caminhos para funcionar na raiz ou na pasta public
    const isSubFolder = window.location.pathname.includes('/public/');
    const prefix = isSubFolder ? '../' : './';

    container.innerHTML = `
        <nav class="fixed top-0 z-50 w-full bg-slate-900 border-b border-slate-800 text-white shadow-2xl">
            <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <img src="${prefix}assets/img/logo.png" alt="GupyMesa" class="h-8 w-auto">
                    <span class="font-black italic tracking-tighter text-2xl uppercase">Gupy<span class="text-indigo-500">Mesa</span></span>
                </div>
                <div class="flex gap-8 text-sm font-bold tracking-widest">
                    <a href="${prefix}index.html" class="hover:text-indigo-400 transition uppercase">Dashboard</a>
                    <a href="${prefix}public/gestao.html" class="text-indigo-400 border-b-2 border-indigo-400 pb-1 uppercase">Gestão</a>
                </div>
            </div>
        </nav>
        <div class="h-16"></div>
    `;
}