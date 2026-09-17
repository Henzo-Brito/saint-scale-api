// Ponto de entrada da API — esse é o arquivo que inicia o servidor.
//
// O Hono é um framework web leve para TypeScript que funciona em vários
// ambientes (Node, Bun, Cloudflare Workers, etc.). Aqui usamos o adaptador
// @hono/node-server para rodá-lo em Node.js.

import { serve } from "@hono/node-server";
import app from "@/app.js";

// O "serve" inicia o servidor HTTP. Ele recebe o handler do Hono (app.fetch)
// e a porta onde o servidor vai escutar.
// A porta é lida da variável de ambiente PORT — útil para quando o app
// está hospedado em alguma plataforma (como o Render), que define
// a porta automaticamente. Se PORT não estiver definido, usa 3000 por padrão.
serve(
	{
		fetch: app.fetch,
		port: Number(process.env.PORT) || 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
