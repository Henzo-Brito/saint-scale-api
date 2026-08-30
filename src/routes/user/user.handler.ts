import type { RouteHandler } from "@hono/zod-openapi";

import { createUser, getUser } from "./user.route.js";
import { userDao } from "./user.dao.js";

export const createUserHandler: RouteHandler<typeof createUser> = async (c) => {
	const data = c.req.valid("json");

	const newUser = await userDao.createUser(data);

	return c.json(newUser);
};

export const getUserHandler: RouteHandler<typeof getUser> = async (c) => {
	const users = await userDao.getUsers();

	return c.json(users);
};