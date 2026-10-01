import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { createRouter } from "@/tools/createAppRoute.js";

import * as handlers from "./user.handler.js";
import * as route from "./user.route.js";

const userRoute = createRouter();

// Rotas públicas
userRoute.openapi(route.createUser, handlers.createUserHandler);

// Rotas protegidas
userRoute.use(route.getUser.getRoutingPath(),          authMiddleware);
userRoute.use(route.getMe.getRoutingPath(),             authMiddleware);
userRoute.use(route.alterEmail.getRoutingPath(),        authMiddleware);
userRoute.use(route.forgotPassword.getRoutingPath(),    authMiddleware);
userRoute.use(route.alterLogradouro.getRoutingPath(),   authMiddleware);
userRoute.use(route.alterBirthday.getRoutingPath(),     authMiddleware);
userRoute.use(route.alterTelephone.getRoutingPath(),    authMiddleware);

userRoute.openapi(route.getUser,          handlers.getUserHandler);
userRoute.openapi(route.getMe,             handlers.getMeHandler);
userRoute.openapi(route.alterEmail,        handlers.alterEmailHandler);
userRoute.openapi(route.forgotPassword,    handlers.forgotPasswordHandler);
userRoute.openapi(route.alterLogradouro,   handlers.alterLogradouroHandler);
userRoute.openapi(route.alterBirthday,     handlers.alterBirthdayHandler);
userRoute.openapi(route.alterTelephone,    handlers.alterTelephoneHandler);

export default userRoute;
