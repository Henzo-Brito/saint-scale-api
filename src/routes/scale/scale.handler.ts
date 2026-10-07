import type { RouteHandler } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";

import type { AppEnv } from "@/tools/createAppRoute.js";
import { scaleDao } from "./scale.dao.js";
import type {
	getMusicByEscalaId,
	getScale,
	getScaleInfo,
	getScaleMembers,
	getScaleMusicDetail,
	getScaleMusics,
	postSair,
	postSubstituir,
} from "./scale.route.js";

// ------------------------------------------------------------------
// GET /scale/{id}
// ------------------------------------------------------------------
export const getScaleHandler: RouteHandler<typeof getScale, AppEnv> = async (
	c,
) => {
	const { id } = c.req.valid("param");
	const data = await scaleDao.getScale(id);
	if (!data)
		return c.json(
			{ message: "Escala não encontrada" },
			HttpStatusCode.NOT_FOUND,
		);
	return c.json(data, HttpStatusCode.OK);
};

// ------------------------------------------------------------------
// GET /scale/{id}/musics
// ------------------------------------------------------------------
export const getScaleMusicsHandler: RouteHandler<
	typeof getScaleMusics,
	AppEnv
> = async (c) => {
	const { id } = c.req.valid("param");
	const data = await scaleDao.getScaleMusics(id);
	return c.json(data, HttpStatusCode.OK);
};

// ------------------------------------------------------------------
// GET /scale/{id}/music/{id_music_escalas}
// ------------------------------------------------------------------
export const getScaleMusicDetailHandler: RouteHandler<
	typeof getScaleMusicDetail,
	AppEnv
> = async (c) => {
	const { id, id_music_escalas } = c.req.valid("param");
	const data = await scaleDao.getScaleMusicDetail(id, id_music_escalas);
	if (!data)
		return c.json(
			{ message: "Música não encontrada" },
			HttpStatusCode.NOT_FOUND,
		);
	return c.json(data, HttpStatusCode.OK);
};

// ------------------------------------------------------------------
// GET /scale/{id}/info
// ------------------------------------------------------------------
export const getScaleInfoHandler: RouteHandler<
	typeof getScaleInfo,
	AppEnv
> = async (c) => {
	const { id } = c.req.valid("param");
	const data = await scaleDao.getScaleInfo(id);
	if (!data)
		return c.json(
			{ message: "Escala não encontrada" },
			HttpStatusCode.NOT_FOUND,
		);
	return c.json(data, HttpStatusCode.OK);
};

// ------------------------------------------------------------------
// GET /scale/{id}/members
// ------------------------------------------------------------------
export const getScaleMembersHandler: RouteHandler<
	typeof getScaleMembers,
	AppEnv
> = async (c) => {
	const { id } = c.req.valid("param");
	const data = await scaleDao.getScaleMembers(id);
	return c.json(data, HttpStatusCode.OK);
};

// ------------------------------------------------------------------
// POST /scale/sair
// Pega o id do membro via JWT (sub) e marca como indisponível
// ------------------------------------------------------------------
export const postSairHandler: RouteHandler<typeof postSair, AppEnv> = async (
	c,
) => {
	const { id_escala } = c.req.valid("json");
	const payload = c.get("jwtPayload");
	const idMembro = payload.sub as string;

	const updated = await scaleDao.sair(id_escala, idMembro);
	if (!updated) {
		return c.json(
			{ message: "Membro não encontrado na escala" },
			HttpStatusCode.NOT_FOUND,
		);
	}
	return c.json({ message: "Saiu da escala com sucesso" }, HttpStatusCode.OK);
};

// ------------------------------------------------------------------
// POST /scale/substituir
// Pega o id do membro atual via JWT (sub) e troca o id_membro_fk
// ------------------------------------------------------------------
export const postSubstituirHandler: RouteHandler<
	typeof postSubstituir,
	AppEnv
> = async (c) => {
	const { id_membro_escala } = c.req.valid("json");
	const payload = c.get("jwtPayload");
	const idMembroAtual = payload.sub as string;

	const data = await scaleDao.substituir(id_membro_escala, idMembroAtual);
	if (!data)
		return c.json(
			{ message: "Membro de escala não encontrado" },
			HttpStatusCode.NOT_FOUND,
		);
	return c.json(data, HttpStatusCode.OK);
};

// ------------------------------------------------------------------
// GET /music/{id_music_escalas}
// Detalhe de uma música sem depender do id da escala (DR-001 opção B)
// ------------------------------------------------------------------
export const getMusicByEscalaIdHandler: RouteHandler<
	typeof getMusicByEscalaId,
	AppEnv
> = async (c) => {
	const { id_music_escalas } = c.req.valid("param");
	const data = await scaleDao.getMusicByEscalaId(id_music_escalas);
	if (!data)
		return c.json(
			{ message: "Música não encontrada" },
			HttpStatusCode.NOT_FOUND,
		);
	return c.json(data, HttpStatusCode.OK);
};
