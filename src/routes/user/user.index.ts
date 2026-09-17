// Esse arquivo monta as rotas do grupo /user e define quais precisam
// de autenticação.
//
// A estratégia aqui é interessante: em vez de aplicar o authMiddleware
// em todas as rotas ou em nenhuma, ele é aplicado seletivamente usando
// o caminho da rota (getRoutingPath()).
//
// Resultado:
//   POST /api/user   → público (qualquer um pode criar uma conta)
//   GET  /api/user   → protegido (precisa de token JWT válido)

import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { createRouter } from "@/tools/createAppRoute.js";

import * as handlers from "./user.handler.js";
import * as route from "./user.route.js";

const userRoute = createRouter();

// Rota de criação de usuário — sem autenticação, pois o usuário ainda
// não tem conta e portanto não tem token.
userRoute.openapi(route.createUser, handlers.createUserHandler);

// Aplica o authMiddleware apenas para a rota GET /user.
// O getRoutingPath() retorna o caminho da rota ("/"), e o middleware
// é registrado especificamente para esse path.
userRoute.use(route.getUser.getRoutingPath(), authMiddleware);

// Rota de listagem de usuários — protegida pelo middleware acima.
userRoute.openapi(route.getUser, handlers.getUserHandler);

export default userRoute;
