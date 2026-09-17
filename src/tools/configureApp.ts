// Esse arquivo configura a documentação interativa da API.
//
// A API usa o padrão OpenAPI (também chamado de Swagger) para descrever
// seus endpoints automaticamente. O Scalar é uma interface visual que
// lê essa documentação e exibe uma página interativa onde dá para
// testar as rotas direto do navegador.
//
// Para acessar: http://localhost:3000/scalar (em desenvolvimento)

import { Scalar } from "@scalar/hono-api-reference";
import type { App } from "./types.ts";

export function configureOpenApi(app: App) {
    // O /doc gera o JSON com a especificação OpenAPI da API.
    // O Scalar lê esse JSON para montar a interface visual.
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

        // Aqui definimos o esquema de segurança Bearer JWT.
        // As rotas que usam segurança vão mostrar um botão de autenticação
        // na interface do Scalar, onde posso colar o token para testar.
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    });

    // Monta a interface visual do Scalar na rota /scalar.
    app.get(
        "/scalar",
        Scalar({
            url: "/doc",  // Aponta para o JSON gerado acima
            darkMode: true,
            favicon: "🔥",
            theme: "kepler",
            layout: "classic",
        }),
    );
}
