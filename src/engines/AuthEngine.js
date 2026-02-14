/**
 * CÉREBRO: AUTH ENGINE
 * Gerencia criptografia, reset de senhas e políticas de acesso.
 */
export const AuthEngine = {
    
    SENHA_PADRAO: "gupy123",

    // Simula a criptografia (No futuro, isso será feito pelo banco Oracle/Postgres)
    criptografarSenha(senhaPlana) {
        // Em produção, isso seria um hash real (bcrypt). 
        // Aqui retornamos um "hash simulado" para visualização.
        return `enc_${btoa(senhaPlana)}`; 
    },

    // Verifica se o usuário está usando a senha padrão (Obriga troca)
    verificarPrimeiroAcesso(senhaAtualCriptografada) {
        const hashPadrao = this.criptografarSenha(this.SENHA_PADRAO);
        return senhaAtualCriptografada === hashPadrao;
    },

    // Ação do Admin: Restaura a senha para o padrão
    resetarSenhaUsuario(usuarioId) {
        console.warn(`[AUDITORIA] Senha do usuário ${usuarioId} resetada pelo Admin.`);
        return this.criptografarSenha(this.SENHA_PADRAO);
    }
};