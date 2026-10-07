import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";

import {
	MusicEscalasParamSchema,
	PatchResponseSchema,
	SairBodySchema,
	ScaleDetailSchema,
	ScaleIdParamSchema,
	ScaleInfoSchema,
	ScaleMembersSchema,
	ScaleMusicDetailSchema,
	ScaleMusicParamSchema,
	ScaleMusicsSchema,
	SubstituirBodySchema,
} from "@/schemas/scale.schemas.js";

const TAG = ["scale"];

const NotFoundSchema = z.object({ message: z.string() }).openapi("NotFound");

// ------------------------------------------------------------------
// GET /scale/{id}
// ------------------------------------------------------------------
export const getScale = createRoute({
	method: "get",
	path: "/scale/{id}",
	tags: TAG,
	security: [{ bearerAuth: [] }],
	request: {
		params: ScaleIdParamSchema,
	},
	responses: {
		[HttpStatusCode.OK]: {
			content: { "application/json": { schema: ScaleDetailSchema } },
			description: "Detalhes de uma escala",
		},
		[HttpStatusCode.NOT_FOUND]: {
			content: { "application/json": { schema: NotFoundSchema } },
			description: "Escala não encontrada",
		},
	},
});

// ------------------------------------------------------------------
// GET /scale/{id}/musics
// ------------------------------------------------------------------
export const getScaleMusics = createRoute({
	method: "get",
	path: "/scale/{id}/musics",
	tags: TAG,
	security: [{ bearerAuth: [] }],
	request: {
		params: ScaleIdParamSchema,
	},
	responses: {
		[HttpStatusCode.OK]: {
			content: { "application/json": { schema: ScaleMusicsSchema } },
			description: "Músicas de uma escala",
		},
	},
});

// ------------------------------------------------------------------
// GET /scale/{id}/music/{id_music_escalas}
// ------------------------------------------------------------------
export const getScaleMusicDetail = createRoute({
	method: "get",
	path: "/scale/{id}/music/{id_music_escalas}",
	tags: TAG,
	security: [{ bearerAuth: [] }],
	request: {
		params: ScaleMusicParamSchema,
	},
	responses: {
		[HttpStatusCode.OK]: {
			content: { "application/json": { schema: ScaleMusicDetailSchema } },
			description: "Detalhe de uma música na escala",
		},
		[HttpStatusCode.NOT_FOUND]: {
			content: { "application/json": { schema: NotFoundSchema } },
			description: "Música não encontrada",
		},
	},
});

// ------------------------------------------------------------------
// GET /scale/{id}/info
// ------------------------------------------------------------------
export const getScaleInfo = createRoute({
	method: "get",
	path: "/scale/{id}/info",
	tags: TAG,
	security: [{ bearerAuth: [] }],
	request: {
		params: ScaleIdParamSchema,
	},
	responses: {
		[HttpStatusCode.OK]: {
			content: { "application/json": { schema: ScaleInfoSchema } },
			description: "Informações detalhadas de uma escala",
		},
		[HttpStatusCode.NOT_FOUND]: {
			content: { "application/json": { schema: NotFoundSchema } },
			description: "Escala não encontrada",
		},
	},
});

// ------------------------------------------------------------------
// GET /scale/{id}/members
// ------------------------------------------------------------------
export const getScaleMembers = createRoute({
	method: "get",
	path: "/scale/{id}/members",
	tags: TAG,
	security: [{ bearerAuth: [] }],
	request: {
		params: ScaleIdParamSchema,
	},
	responses: {
		[HttpStatusCode.OK]: {
			content: { "application/json": { schema: ScaleMembersSchema } },
			description: "Membros de uma escala",
		},
	},
});

// ------------------------------------------------------------------
// POST /scale/sair
// ------------------------------------------------------------------
export const postSair = createRoute({
	method: "post",
	path: "/scale/sair",
	tags: TAG,
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: { "application/json": { schema: SairBodySchema } },
		},
	},
	responses: {
		[HttpStatusCode.OK]: {
			content: { "application/json": { schema: PatchResponseSchema } },
			description: "Membro marcado como indisponível na escala.",
		},
		[HttpStatusCode.NOT_FOUND]: {
			content: { "application/json": { schema: NotFoundSchema } },
			description: "Membro não encontrado na escala",
		},
	},
});

// ------------------------------------------------------------------
// POST /scale/substituir
// ------------------------------------------------------------------
export const postSubstituir = createRoute({
	method: "post",
	path: "/scale/substituir",
	tags: TAG,
	security: [{ bearerAuth: [] }],
	request: {
		body: {
			content: { "application/json": { schema: SubstituirBodySchema } },
		},
	},
	responses: {
		[HttpStatusCode.OK]: {
			content: { "application/json": { schema: ScaleMembersSchema } },
			description: "Substituição realizada. Retorna membros atualizados.",
		},
		[HttpStatusCode.NOT_FOUND]: {
			content: { "application/json": { schema: NotFoundSchema } },
			description: "Membro escala não encontrado",
		},
	},
});

// ------------------------------------------------------------------
// GET /music/{id_music_escalas}
// Novo endpoint que não depende do scale_id — resolve DR-001 opção B.
// Usado pela tela /music/[id] do frontend (apenas um parâmetro de rota).
// ------------------------------------------------------------------
export const getMusicByEscalaId = createRoute({
	method: "get",
	path: "/music/{id_music_escalas}",
	tags: TAG,
	security: [{ bearerAuth: [] }],
	request: {
		params: MusicEscalasParamSchema,
	},
	responses: {
		[HttpStatusCode.OK]: {
			content: { "application/json": { schema: ScaleMusicDetailSchema } },
			description:
				"Detalhe de uma música a partir do id da associação músicas_escalas.",
		},
		[HttpStatusCode.NOT_FOUND]: {
			content: { "application/json": { schema: NotFoundSchema } },
			description: "Música não encontrada",
		},
	},
});
