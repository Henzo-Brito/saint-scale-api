import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { createRouter } from "@/tools/createAppRoute.js";

import * as handlers from "./alert.handler.js";
import * as routes from "./alert.route.js";

const alertRoute = createRouter();

alertRoute.use("*", authMiddleware);

alertRoute.openapi(routes.getReminder, handlers.getReminderHandler);
alertRoute.openapi(routes.getReminderDetail, handlers.getReminderDetailHandler);

export default alertRoute;
