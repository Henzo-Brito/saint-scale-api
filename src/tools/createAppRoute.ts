import { OpenAPIHono } from "@hono/zod-openapi";
import { configureOpenApi } from "@/tools/configureApp.js";
import { notFound, onError } from "stoker/middlewares";
import { cors } from "hono/cors";
import type { JWTPayload } from "jose";

export type AppEnv = {
    Variables: {
        jwtPayload: JWTPayload;
    };
};

export function createApp() {
    const app = new OpenAPIHono<AppEnv>();

    app.onError(onError);
    app.notFound(notFound);

    app.use(
        "*",
        cors({
            origin: "http://localhost:8081",
        }),
    );

    configureOpenApi(app);

    return app;
}

export function createRouter() {
    return new OpenAPIHono<AppEnv>();
}
