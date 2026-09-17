// Handler da rota de login.
//
// O handler é a função que recebe a requisição HTTP e devolve a resposta.
// Ele não tem lógica de negócio — delega isso para o serviço (auth.service.ts).
// O trabalho dele é:
//   1. Pegar os dados validados da requisição
//   2. Chamar o serviço
//   3. Retornar a resposta adequada

import type { RouteHandler } from "@hono/zod-openapi";

import { SignIn } from "./auth.route.js";
import { signIn } from "./auth.service.js";

export const loginHandler: RouteHandler<typeof SignIn> = async (c) => {
    // O c.req.valid("json") retorna os dados do corpo já validados pelo zod.
    // O @hono/zod-openapi cuida disso automaticamente com base no schema
    // definido em auth.route.ts — se chegarem dados inválidos, o Hono
    // já rejeita antes de chegar aqui.
    const data = c.req.valid("json");

    // Chama a lógica de negócio do serviço.
    // O resultado é null se as credenciais forem inválidas,
    // ou um objeto com accessToken se o login der certo.
    const result = await signIn(data);

    if (!result) {
        return c.json(
            {
                message: "Email ou senha inválidos",
            },
            401, // 401 Unauthorized
        );
    }

    return c.json(
        {
            accessToken: result.accessToken,
            tokenType: "Bearer" as const,
        },
        200,
    );
};
