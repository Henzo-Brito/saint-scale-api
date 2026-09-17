// ATENÇÃO: Esse arquivo não está sendo usado em nenhuma parte do projeto.
//
// Ele define uma função alternativa para criar tokens JWT, mas a lógica
// de geração de tokens já está implementada diretamente em auth.service.ts
// usando o SignJWT do jose.
//
// As diferenças em relação ao auth.service.ts:
//   - Esse arquivo usa expiry de 15 minutos (o service usa 1 hora)
//   - Esse arquivo não inclui email e role no payload
//
// Por não ser importado em lugar nenhum, esse código nunca é executado.

import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function createAccessToken(payload: {
    sub: string;
}) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15m")
        .sign(secret);
}
