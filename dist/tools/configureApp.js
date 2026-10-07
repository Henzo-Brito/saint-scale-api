import { Scalar } from "@scalar/hono-api-reference";
export function configureOpenApi(app) {
    app.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
    });
    app.doc("/doc", {
        openapi: "3.0.0",
        info: {
            title: "Saint Scale",
            version: "0.0.0",
            license: {
                name: "MIT",
            },
            description: "Uma Api para o aplicativo Saint Scale",
            contact: {
                email: "henzo.2025@proton.me",
                name: "Henzo Brito dos Santos",
            },
        },
    });
    app.get("/scalar", Scalar({
        url: "/doc",
        darkMode: true,
        favicon: "🔥",
        theme: "bluePlanet",
        layout: "classic",
    }));
}
