// src/engines/AuthEngine.js

export class AuthEngine {
    /**
     * Realiza a autenticação do usuário no BigQuery via API
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
            throw new Error(errorData.mensagem || 'Erro de conexão ou credenciais inválidas');
        }

        const data = await response.json();
        
        // Salva a sessão para persistência
        localStorage.setItem('gupymesa_user', JSON.stringify(data.usuario));
        return data.usuario;
    }

    /**
     * Logout: Limpa a sessão e redireciona
     */
    static logout() {
        console.log("👋 Saindo do sistema...");
        localStorage.removeItem('gupymesa_user');
        window.location.href = '/index.html';
    }

    /**
     * Segurança: Verifica se está logado
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