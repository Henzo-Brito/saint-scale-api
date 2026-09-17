// Schemas de validação e tipos relacionados à autenticação no backend.
//
// O .openapi() no final de cada schema registra o tipo na documentação
// automática gerada pelo Scalar. Então quando abrir /scalar, vai aparecer
// uma seção com esses modelos explicados.

import { z } from "@hono/zod-openapi";

// Dados esperados no corpo da requisição de login.
export const SignInSchema = z
    .object({
        email: z.email().max(100),
        // A senha precisa ter pelo menos 8 caracteres.
        password: z.string().min(8).max(255),
    })
    .openapi("SignIn");

// Formato da resposta enviada quando o login é bem-sucedido.
// O tokenType "Bearer" é uma convenção do protocolo OAuth2 —
// indica que o token deve ser enviado no header "Authorization: Bearer <token>".
export const JWTSchema = z
    .object({
        accessToken: z.string(),
        tokenType: z.literal("Bearer"),
    })
    .openapi("JWT");

// Formato da resposta de erro de autenticação.
export const UNAUTHORIZEDSchema = z
    .object({
        message: z.string(),
    })
    .openapi("Unauthorized");

export type SignIn = z.infer<typeof SignInSchema>;
export type JWT = z.infer<typeof JWTSchema>;
export type UNAUTHORIZED = z.infer<typeof UNAUTHORIZEDSchema>;
