import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { createRouter } from "@/tools/createAppRoute.js";

import * as handlers from "./user.handler.js";
import * as route from "./user.route.js";

const userRoute = createRouter();

// ── Rotas públicas ───────────────────────────────────────────────
userRoute.openapi(route.createUser, handlers.createUserHandler);
userRoute.openapi(route.forgotPassword, handlers.forgotPasswordHandler); // identifica por email

// ── Rotas protegidas (JWT obrigatório) ──────────────────────────
userRoute.use(route.getUsers.getRoutingPath(), authMiddleware);
userRoute.use(route.getMe.getRoutingPath(), authMiddleware);
userRoute.use(route.alterEmail.getRoutingPath(), authMiddleware);
userRoute.use(route.alterLogradouro.getRoutingPath(), authMiddleware);
userRoute.use(route.alterBirthday.getRoutingPath(), authMiddleware);
userRoute.use(route.alterTelephone.getRoutingPath(), authMiddleware);

userRoute.openapi(route.getUsers, handlers.getUsersHandler);
userRoute.openapi(route.getMe, handlers.getMeHandler);
userRoute.openapi(route.alterEmail, handlers.alterEmailHandler);
userRoute.openapi(route.alterLogradouro, handlers.alterLogradouroHandler);
userRoute.openapi(route.alterBirthday, handlers.alterBirthdayHandler);
userRoute.openapi(route.alterTelephone, handlers.alterTelephoneHandler);

export default userRoute;
