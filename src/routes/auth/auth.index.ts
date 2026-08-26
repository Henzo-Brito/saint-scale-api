import { createRouter } from "@/tools/createAppRoute.js";
import * as handlers from "./auth.handler.js";
import * as route from "./auth.route.js";

const authRoute = createRouter();

authRoute.openapi(route.SignIn, handlers.loginHandler);

export default authRoute;