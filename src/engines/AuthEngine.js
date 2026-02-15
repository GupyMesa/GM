// src/engines/AuthEngine.js

export class AuthEngine {
    /**
     * Realiza a autenticação do usuário no BigQuery
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
            throw new Error(errorData.mensagem || 'Credenciais inválidas ou erro de rede');
        }

        const data = await response.json();
        
        // Armazena a sessão no navegador (persistência)
        localStorage.setItem('gupymesa_user', JSON.stringify(data.usuario));
        return data.usuario;
    }

    /**
     * Remove os dados da sessão e redireciona para o login
     */
    static logout() {
        console.log("👋 Encerrando sessão do GupyMesa...");
        localStorage.removeItem('gupymesa_user');
        window.location.href = '/index.html';
    }

    /**
     * Verifica se existe um usuário logado. Se não houver, bloqueia o acesso.
     */
    static checkAccess() {
        const user = localStorage.getItem('gupymesa_user');
        if (!user) {
            console.warn("⚠️ Acesso não autorizado. Redirecionando...");
            window.location.href = '/index.html';
            return null;
        }
        return JSON.parse(user);
    }
}