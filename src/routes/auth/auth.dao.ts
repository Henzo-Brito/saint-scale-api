// DAO (Data Access Object) de autenticação.
//
// O DAO é o único lugar do código que fala diretamente com o banco de dados.
// Essa separação é útil porque se eu precisar trocar o banco no futuro,
// só preciso mudar aqui — o resto do código não precisa saber como os dados
// são buscados.

import { pool } from "@/db/index.js";

export const SignInDAO = {
    async findUserByEmail(email: string) {
        // Query parametrizada usando $1 — isso evita SQL Injection.
        // Em vez de montar a string SQL com o email direto (o que seria perigoso),
        // o pg substitui o $1 pelo valor com segurança.
        const result = await pool.query(
            `
            SELECT
                id_membro AS id_member,
                email,
                senha AS password,
                cargo AS role
            FROM membros
            WHERE email = $1
            LIMIT 1
            `,
            [email],
        );

        // Se encontrar o usuário, retorna o primeiro (e único) resultado.
        // Se não encontrar, retorna null — o LIMIT 1 garante no máximo um resultado.
        return result.rows[0] ?? null;
    },
};
