import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { notFound, onError } from "stoker/middlewares";
import { configureOpenApi } from "@/tools/configureApp.js";
export function createApp() {
    const app = new OpenAPIHono();
    app.onError(onError);
    app.notFound(notFound);
    // CORS_ORIGIN em .env: "*" para dev/mobile, ou domínio específico para produção web.
    // Apps React Native nativos não enviam Origin, então qualquer valor funciona para eles.
    const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:8081";
    app.use("*", cors({
        origin: corsOrigin,
    }));
    configureOpenApi(app);
    return app;
}
export function createRouter() {
    return new OpenAPIHono();
}
