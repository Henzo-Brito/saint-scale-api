import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

export const SignIn = createRoute({
  method: "post",
  path: "/login",
  responses: {
    [HttpStatusCode.OK]: jsonContent(
      z.object({}),
      ""
    ),
	},
  tags: ["Auth"]
});