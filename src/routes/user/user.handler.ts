import type { RouteHandler } from "@hono/zod-openapi";
import { createUser, getUser } from "./user.route.js";
import { createUserDao, getUserDao } from "./user.dao.js";

export const createUserHandler: RouteHandler<typeof createUser> = async (c) => {
    const data = c.req.valid('json');
    
    const newUser = createUserDao(data);

	console.log(newUser)

    return c.json(newUser);
};

export const getUserHandler: RouteHandler<typeof getUser> = async (c) => {
    const users = getUserDao();

    return c.json(users);
};