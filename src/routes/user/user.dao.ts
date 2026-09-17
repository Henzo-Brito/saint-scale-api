// DAO de usuários — contém todas as queries SQL que manipulam a tabela "membros".
//
// O padrão DAO (Data Access Object) isola o código de acesso ao banco
// em um único lugar. Isso deixa os handlers e serviços mais limpos e
// facilita reutilizar a mesma query em diferentes partes do código.

import argon2 from "argon2";
import type { User, CreateUser } from "@/schemas/user.schemas.js";
import { pool } from "@/db/index.js";

export const userDao = {
    async createUser(user: CreateUser): Promise<User> {
        // O frontend envia a data no formato MM-DD-YYYY (após converter de DD/MM/YYYY).
        // O PostgreSQL espera YYYY-MM-DD para o tipo TIMESTAMP.
        // Então aqui fazemos a última conversão: MM-DD-YYYY → YYYY-MM-DD.
        const [month, day, year] = user.birth_date.split("-");
        const birthDate = `${year}-${month}-${day}`;

        // Antes de salvar, gera um hash da senha usando argon2id.
        // Nunca salvamos a senha em texto puro — isso é uma prática essencial
        // de segurança. O argon2id é o algoritmo recomendado atualmente
        // por ser resistente a ataques de força bruta e de dicionário.
        const hashedPassword = await argon2.hash(user.password, {
            type: argon2.argon2id,
        });

        // O RETURNING no final da query faz o PostgreSQL devolver os dados
        // do registro que acabou de ser inserido — assim não precisamos
        // fazer uma segunda query para buscar o usuário recém-criado.
        const result = await pool.query(
            `
            INSERT INTO membros (
                nome,
                data_nascimento,
                telefone,
                email,
                senha,
                cargo,
                id_funcao_fk,
                id_logradouro_fk
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING
                id_membro AS id_member,
                nome AS name,
                data_registro AS register_date,
                data_nascimento AS birth_date,
                telefone AS telephone,
                email,
                senha AS password,
                cargo AS role,
                id_funcao_fk AS id_function,
                id_logradouro_fk AS id_logradouro
            `,
            [
                user.name,
                birthDate,
                user.telephone,
                user.email,
                hashedPassword,
                "membro",   // Cargo padrão para novos membros
                null,       // Sem função específica por enquanto
                null,       // Sem logradouro por enquanto
            ],
        );

        return result.rows[0] as User;
    },

    async getUsers(): Promise<User[]> {
        // Busca todos os membros. Os campos do banco (snake_case com prefixo ID_)
        // são renomeados com AS para corresponder ao schema do zod (UserSchema).
        const result = await pool.query(`
            SELECT
                id_membro AS id_member,
                nome AS name,
                data_registro AS register_date,
                data_nascimento AS birth_date,
                telefone AS telephone,
                email,
                senha AS password,
                cargo AS role,
                id_funcao_fk AS id_function,
                id_logradouro_fk AS id_logradouro
            FROM membros
        `);

        return result.rows as User[];
    },

    // Essa função está definida aqui mas não é chamada em nenhuma rota ainda.
    // Pode ser útil futuramente para buscar um usuário específico.
    async getUserByEmail(email: string): Promise<User | null> {
        const result = await pool.query(
            `
            SELECT
                id_membro AS id_member,
                nome AS name,
                data_registro AS register_date,
                data_nascimento AS birth_date,
                telefone AS telephone,
                email,
                senha AS password,
                cargo AS role,
                id_funcao_fk AS id_function,
                id_logradouro_fk AS id_logradouro
            FROM membros
            WHERE email = $1
            LIMIT 1
            `,
            [email],
        );

        return result.rows[0] ?? null;
    },
};
