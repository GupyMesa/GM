// src/engines/AuthEngine.js
export class AuthEngine {
    /**
     * Realiza a autenticação do usuário
     */
    static async login(id, senha) {
        console.log(`🔄 Iniciando login para ID: ${id}`);
        
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, senha })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.mensagem || 'Erro de conexão com servidor');
        }

        const data = await response.json();
        
        // Salva os dados do usuário no navegador
        localStorage.setItem('gupymesa_user', JSON.stringify(data.usuario));
        return data.usuario;
    }

    /**
     * Encerra a sessão do usuário
     */
    static logout() {
        console.log("👋 Encerrando sessão...");
        localStorage.removeItem('gupymesa_user');
        window.location.href = '/index.html';
    }

    /**
     * Verifica se o usuário está logado e retorna os dados
     */
    static checkAccess() {
        const user = localStorage.getItem('gupymesa_user');
        if (!user) {
            console.warn("⚠️ Acesso negado. Redirecionando para login...");
            window.location.href = '/index.html';
            return null;
        }
        return JSON.parse(user);
    }
}