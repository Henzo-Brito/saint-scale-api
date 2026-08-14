import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes"
import z from "zod"

export const createUser = createRoute({
    method: "post",
	path: "/",
	responses: {
		[HttpStatusCode.OK]: {
			content: {
				"application/json": {
					schema: z.object({
						name: z.string(),
					}),
				},
			},
			description: "Retornara o Nome da pessoa",
		},
	},
	description: "Get All users in Database",
});

