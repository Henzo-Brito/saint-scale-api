// Definição da rota de login usando o @hono/zod-openapi.
//
// O createRoute combina três coisas de uma só vez:
//   1. Define os detalhes da rota HTTP (método, path, body esperado, respostas)
//   2. Conecta os schemas zod para validação automática
//   3. Gera a documentação OpenAPI automaticamente
//
// Isso significa que quando eu abrir o /scalar, essa rota já vai aparecer
// documentada, com exemplos de request e response, sem precisar escrever
// documentação separada.

import { JWTSchema, SignInSchema, UNAUTHORIZEDSchema } from "@/schemas/auth.schemas.js";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

export const SignIn = createRoute({
  method: "post",
  path: "/login",
  request: {
    // Define que o corpo da requisição deve ser um JSON que corresponde
    // ao SignInSchema (email + password).
    body: jsonContent(
      SignInSchema,
      "Precisará do nome e do E-mail"
    )
  },
  responses: {
    // Se o login der certo, retorna 200 com o token JWT.
    [HttpStatusCode.OK]: jsonContent(
      JWTSchema,
      "Retorna um acess Token JWT e um tipo do token"
    ),
    // Se as credenciais forem inválidas, retorna 401 com uma mensagem de erro.
    [HttpStatusCode.UNAUTHORIZED]: jsonContent(
      UNAUTHORIZEDSchema,
      "Retornará uma message"
    )
  },
  tags: ["Auth"] // Agrupa essa rota na seção "Auth" da documentação
});
