import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";
import { UserSchema, CreateUserSchema } from "./user.dao.js";

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
		}
	}
});

export const getUser = createRoute({
  method: "get",
  path: "/",
  responses: {
    [HttpStatusCode.OK]: {
      content: {
        "application/json": {
          schema: z.array(UserSchema),
        },
		},
		description: "Creates a new user successfully",
		}
	}
});