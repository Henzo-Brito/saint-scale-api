import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { createRouter } from "@/tools/createAppRoute.js";

import * as handlers from "./scale.handler.js";
import * as routes from "./scale.route.js";

const scaleRoute = createRouter();

scaleRoute.use("*", authMiddleware);

scaleRoute.openapi(routes.getScale,              handlers.getScaleHandler);
scaleRoute.openapi(routes.getScaleMusics,        handlers.getScaleMusicsHandler);
scaleRoute.openapi(routes.getScaleMusicDetail,   handlers.getScaleMusicDetailHandler);
scaleRoute.openapi(routes.getScaleInfo,          handlers.getScaleInfoHandler);
scaleRoute.openapi(routes.getScaleMembers,       handlers.getScaleMembersHandler);
scaleRoute.openapi(routes.postSair,              handlers.postSairHandler);
scaleRoute.openapi(routes.postSubstituir,        handlers.postSubstituirHandler);

export default scaleRoute;
