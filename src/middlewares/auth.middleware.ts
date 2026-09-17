// Middleware de autenticação JWT.
//
// Esse arquivo funciona como uma barreira de proteção para as rotas privadas
// da API. Antes de deixar uma requisição chegar numa rota protegida, ele
// verifica se o token JWT é válido.
//
// O fluxo é:
//   1. A requisição chega com o header "Authorization: Bearer <token>"
//   2. O middleware extrai o token
//   3. Verifica se o token foi assinado com o JWT_SECRET correto
//   4. Verifica se o token ainda não expirou (expira em 1h)
//   5. Se tudo certo, salva o payload do token no contexto e deixa passar
//   6. Se algo errar, retorna 401 (não autorizado)

import { jwtVerify } from "jose";
import type { Context, Next } from "hono";
import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;

// Verificação em tempo de inicialização: se o JWT_SECRET não estiver
// configurado, o servidor não vai nem iniciar. Melhor falhar cedo
// do que deixar a autenticação funcionando com uma chave indefinida.
if (!jwtSecret) {
    throw new Error("JWT_SECRET não está configurado");
}

// O TextEncoder transforma a string do segredo em bytes (Uint8Array),
// que é o formato que a biblioteca jose espera.
const secret = new TextEncoder().encode(jwtSecret);

export const authMiddleware = async (c: Context, next: Next) => {
    // Tenta pegar o header Authorization da requisição.
    const authorization = c.req.header("Authorization");

    if (!authorization) {
        return c.json(
            {
                message: "Token não informado",
            },
            401,
        );
    }

    // O formato esperado é "Bearer eyJhbGciO..." — dividimos em tipo e token.
    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
        return c.json(
            {
                message: "Token inválido",
            },
            401,
        );
    }

    try {
        // jwtVerify verifica a assinatura do token e decodifica o payload.
        // Se o token tiver sido modificado ou expirado, ele lança uma exceção.
        const { payload } = await jwtVerify(token, secret);

        // Salva o payload decodificado no contexto do Hono.
        // Assim, nas rotas que usam esse middleware, posso acessar
        // c.get("jwtPayload") para saber quem fez a requisição (email, role, sub).
        c.set("jwtPayload", payload);

        // Chama o próximo handler (a rota em si).
        await next();
    } catch {
        return c.json(
            {
                message: "Token inválido ou expirado",
            },
            401,
        );
    }
};
