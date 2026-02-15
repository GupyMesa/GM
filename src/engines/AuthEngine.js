export class AuthEngine {
    /**
     * Envia os dados de login para o servidor
     * @param {string} id - O ID do usuário
     * @param {string} senha - A senha do usuário
     */
    static async login(id, senha) {
        try {
            console.log('Tentando logar com ID:', id);
            
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, senha })
            });

            const data = await response.json();
            console.log('Resposta do servidor:', data);

            if (data.sucesso) {
                // 1. Salvar os dados do usuário no navegador (Sessão)
                localStorage.setItem('usuario_logado', JSON.stringify(data.usuario));
                
                // 2. Redirecionar baseado no cargo
                if (data.usuario.cargo === 'Gestora' || data.usuario.cargo === 'Admin') {
                    window.location.href = 'public/gestao.html';
                } else {
                    // Se for Auditora ou outro cargo
                    window.location.href = 'public/dashboard.html'; 
                }
            } else {
                alert(data.mensagem || 'ID ou Senha incorretos.');
            }
        } catch (error) {
            console.error('Erro técnico no login:', error);
            alert('Erro ao conectar com o servidor. Tente novamente.');
        }
    }
}
