import { Scalar } from "@scalar/hono-api-reference";
import type { App } from "./types.ts";

export function configureOpenApi(app: App) {
	app.doc("/doc", {
		openapi: "3.0.0",
		info: {
			title: "Saint Scale ",
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

    app.get('/scalar', Scalar({ url: '/doc' }))
}