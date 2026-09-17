// Serviço de autenticação — contém a lógica de negócio do login.
//
// A camada de "serviço" fica entre o handler (que recebe a requisição HTTP)
// e o DAO (que acessa o banco). Ela é responsável pela lógica em si:
// verificar a senha, gerar o token, etc.

import argon2 from "argon2";
import { SignJWT } from "jose";

import type { SignIn } from "@/schemas/auth.schemas.js";
import { SignInDAO } from "./auth.dao.js";

// O segredo usado para assinar os tokens JWT.
// É lido das variáveis de ambiente para não ficar exposto no código.
// O TextEncoder converte a string para bytes, que é o que o jose precisa.
const secret = new TextEncoder().encode(
    process.env.JWT_SECRET,
);

export const signIn = async (data: SignIn) => {
    // Primeiro, busca o usuário pelo email no banco.
    // Se não encontrar, retorna null — sem revelar se o email existe ou não.
    const user = await SignInDAO.findUserByEmail(data.email);

    if (!user) {
        return null;
    }

    // O argon2 é um algoritmo moderno e seguro para verificar senhas.
    // As senhas nunca são salvas em texto puro — ficam como um "hash" no banco.
    // O argon2.verify compara a senha digitada com o hash salvo, sem precisar
    // descriptografar nada (é matematicamente impossível fazer o caminho inverso).
    const passwordValid = await argon2.verify(
        user.password,  // Hash salvo no banco
        data.password,  // Senha digitada pelo usuário
    );

    if (!passwordValid) {
        return null;
    }

    // Gera o JWT (JSON Web Token) que será usado para autenticar as próximas
    // requisições. O token contém informações sobre o usuário (payload) e
    // é assinado com o JWT_SECRET — só a API consegue verificar se é válido.
    const accessToken = await new SignJWT({
        email: user.email,
        role: user.role,    // Cargo do membro (ex: organizador, líder, membro)
    })
        .setProtectedHeader({ alg: "HS256" })   // Algoritmo de assinatura
        .setSubject(String(user.id_member))      // "sub" = identificador único do usuário
        .setIssuedAt()                           // Registra quando o token foi criado
        .setExpirationTime("1h")                 // O token expira em 1 hora
        .sign(secret);

    return {
        accessToken,
    };
};
