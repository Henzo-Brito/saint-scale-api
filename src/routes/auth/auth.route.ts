import { JWTSchema, SignInSchema, UNAUTHORIZEDSchema } from "@/schemas/auth.schemas.js";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

export const SignIn = createRoute({
  method: "post",
  path: "/login",
  request: {
    body: jsonContent(
      SignInSchema,
      "Precisará do nome e do E-mail"
    )
  },
  responses: {
    [HttpStatusCode.OK]: jsonContent(
      JWTSchema,
      "Retorna um acess Token JWT e um tipo do token"
    ),
    [HttpStatusCode.UNAUTHORIZED]: jsonContent(
      UNAUTHORIZEDSchema,
      "Retornará uma message"
    )
	},
  tags: ["Auth"]
});