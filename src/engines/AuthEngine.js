// src/engines/AuthEngine.js
class AuthEngine {
    // ... métodos de login existentes ...

    static logout() {
        console.log("👋 Encerrando sessão...");
        localStorage.removeItem('gupymesa_user');
        window.location.href = '/index.html';
    }

    static checkAccess() {
        const user = localStorage.getItem('gupymesa_user');
        if (!user) {
            window.location.href = '/index.html';
        }
        return JSON.parse(user);
    }
}
export default AuthEngine;