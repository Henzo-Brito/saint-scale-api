import { createRouter } from "@/tools/createAppRoute.js";
import * as handlers from "./user.handler.js";
import * as route from "./user.route.js";

const taskRoute = createRouter();

taskRoute.openapi(route.createUser, handlers.createUserHandler);

taskRoute.openapi(route.getUser, handlers.getUserHandler);

export default taskRoute;