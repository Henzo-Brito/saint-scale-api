import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";

import {
	CreateUserSchema,
	UserSchema,
} from "@/schemas/user.schemas.js";

export const createUser = createRoute({
	method: "post",
	path: "/",
	request: {
		body: {
			content: {
				"application/json": {
					schema: CreateUserSchema,
				},
			},
		},
	},
	responses: {
		[HttpStatusCode.OK]: {
			content: {
				"application/json": {
					schema: UserSchema,
				},
			},
			description: "Creates a new user successfully",
		},
	},
	tags: ["User"],
});

export const getUser = createRoute({
	method: "get",
	path: "/",

	security: [
		{
			bearerAuth: [],
		},
	],

	responses: {
		[HttpStatusCode.OK]: {
			content: {
				"application/json": {
					schema: z.array(UserSchema),
				},
			},
			description: "Gets all users successfully",
		},
	},

	tags: ["User"],
});