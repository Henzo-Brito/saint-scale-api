import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { createRouter } from "@/tools/createAppRoute.js";

import * as handlers from "./user.handler.js";
import * as route from "./user.route.js";

const userRoute = createRouter();

userRoute.openapi(route.createUser, handlers.createUserHandler);

userRoute.use(route.getUser.getRoutingPath(), authMiddleware);

userRoute.openapi(route.getUser, handlers.getUserHandler);

export default userRoute;
