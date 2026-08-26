import type { RouteHandler } from "@hono/zod-openapi";
import { SignIn } from "./auth.route.js";
import { SignInDAO } from "./auth.dao.js";


export const loginHandler: RouteHandler<typeof SignIn> = async (c) => {
    c.status(200);
    return c.json({});
};