// Esse arquivo monta o app principal da API.
//
// O createApp() cria a instância do Hono com todas as configurações globais
// (CORS, documentação OpenAPI, tratamento de erros). Então as rotas são
// registradas em cima dessa instância.
//
// A separação entre app.ts e index.ts serve para que o app possa ser
// importado e testado sem precisar iniciar o servidor.

import { createApp } from "./tools/createAppRoute.js";
import apiRoute from "./routes/api.js";

const app = createApp()

// Todas as rotas da API são montadas sob o prefixo "/api/".
// Então uma rota definida como "/user" vai estar acessível em "/api/user".
app.route("/api/", apiRoute)

export default app
