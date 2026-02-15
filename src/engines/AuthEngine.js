export class AuthEngine {
    static async login(id, senha) {
        console.log('Tentando logar ID:', id);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, senha })
            });

            if (!response.ok) throw new Error('Erro na rede');

            const data = await response.json();
            
            if (data.sucesso) {
                localStorage.setItem('usuario_logado', JSON.stringify(data.usuario));
                // Redirecionamento simples para testar
                alert('Login Sucesso! Redirecionando...');
                window.location.href = 'public/gestao.html';
            } else {
                alert(data.mensagem || 'Login falhou');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao conectar. Veja o console (F12).');
        }
    }
}
