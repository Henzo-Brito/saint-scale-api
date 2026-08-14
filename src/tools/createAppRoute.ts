import { OpenAPIHono } from "@hono/zod-openapi"
import { configureOpenApi } from "@/tools/configureApp.js";
import { notFound, onError } from "stoker/middlewares";

export function createApp(){
    const app = new OpenAPIHono();

    app.onError(onError)
    app.notFound(notFound)

    configureOpenApi(app)

    return app
}

export function createRouter(){
    const route = new OpenAPIHono();

    return route
}

