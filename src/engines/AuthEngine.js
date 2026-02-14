/**
 * CÉREBRO: AUTH ENGINE
 * Gerencia criptografia, senhas padrão e permissões.
 */
export const AuthEngine = {
    
    CONSTANTES: {
        SENHA_PADRAO: "gupy123",
        SALT_ROUNDS: 10 // Para uso futuro com bcrypt
    },

    /**
     * Gera um hash simulado para a senha (em produção usaremos bcrypt no backend)
     */
    criptografarSenha(senhaPlana) {
        // Simulação de hash para visualização
        return `hash_${btoa(senhaPlana)}`; 
    },

    /**
     * Verifica se a senha atual é a padrão, forçando a troca
     */
    ehSenhaPadrao(senhaCriptografada) {
        const hashPadrao = this.criptografarSenha(this.CONSTANTES.SENHA_PADRAO);
        return senhaCriptografada === hashPadrao;
    },

    /**
     * Retorna o objeto de senha resetada para salvar no banco
     */
    gerarPayloadResetSenha() {
        return {
            senha_hash: this.criptografarSenha(this.CONSTANTES.SENHA_PADRAO),
            precisa_trocar_senha: true,
            resetado_em: new Date().toISOString()
        };
    }
};