export class AuthEngine {
    static async login(id, senha) {
        console.log('🔄 Iniciando login para ID:', id);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, senha })
            });

            if (!response.ok) throw new Error('Erro de conexão com servidor');

            const data = await response.json();
            
            if (data.sucesso) {
                console.log('✅ Login autorizado!');
                localStorage.setItem('usuario_logado', JSON.stringify(data.usuario));
                window.location.href = 'public/gestao.html';
            } else {
                console.warn('❌ Login negado:', data.mensagem);
                alert(data.mensagem || 'ID ou Senha incorretos.');
            }
        } catch (error) {
            console.error('🔥 Erro Crítico:', error);
            alert('Erro ao conectar. Tente novamente.');
        }
    }
}
