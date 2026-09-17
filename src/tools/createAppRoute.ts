// Esse arquivo contém as funções auxiliares para criar o app principal
// e os roteadores individuais do Hono.
//
// Usar funções como createApp() e createRouter() em vez de instanciar
// o OpenAPIHono diretamente facilita manter a configuração consistente
// em toda a aplicação.

import { OpenAPIHono } from "@hono/zod-openapi"
import { configureOpenApi } from "@/tools/configureApp.js";
import { notFound, onError } from "stoker/middlewares";
import { cors } from "hono/cors";

export function createApp(){
    // OpenAPIHono é uma versão especial do Hono que integra a validação
    // do zod com a geração automática de documentação OpenAPI.
    // Todas as rotas definidas com createRoute() aparecem automaticamente
    // na documentação em /scalar.
    const app = new OpenAPIHono();

    // Configura handlers globais de erros — onError captura erros não tratados
    // e notFound retorna uma resposta padronizada para rotas inexistentes.
    app.onError(onError)
    app.notFound(notFound)
    
    // CORS (Cross-Origin Resource Sharing) controla quais origens podem
    // fazer requisições para a API. Aqui está configurado para aceitar
    // apenas localhost:8081 — a porta padrão do Expo no desenvolvimento.
    //
    // ATENÇÃO: Isso significa que a API deployada no Render não vai aceitar
    // requisições do app em produção, a menos que a origem seja ajustada.
    app.use(
        "*",
        cors({
            origin: "http://localhost:8081",
        }),
    );
    
    // Configura a documentação interativa (Scalar) e o schema OpenAPI.
    configureOpenApi(app)

    return app
}

// createRouter cria um roteador sem as configurações globais (sem CORS, sem OpenAPI doc).
// É usado para criar os sub-roteadores de cada grupo de rotas.
export function createRouter(){
    const route = new OpenAPIHono();

    return route
}
