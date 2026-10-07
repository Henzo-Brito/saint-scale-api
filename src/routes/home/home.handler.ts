import type { RouteHandler } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";

import type { AppEnv } from "@/tools/createAppRoute.js";
import { homeDao } from "./home.dao.js";
import type {
	getMonth,
	getMyScales,
	getScaleDay,
	getUnavailability,
} from "./home.route.js";

export const getMonthHandler: RouteHandler<typeof getMonth, AppEnv> = async (
	c,
) => {
	const { mes } = c.req.valid("param");
	const data = await homeDao.getMonth(mes);
	return c.json(data, HttpStatusCode.OK);
};

export const getUnavailabilityHandler: RouteHandler<
	typeof getUnavailability,
	AppEnv
> = async (c) => {
	const { mes } = c.req.valid("param");
	const data = await homeDao.getUnavailability(mes);
	return c.json(data, HttpStatusCode.OK);
};

// ID do membro extraído do JWT — sem parâmetro de URL.
export const getMyScalesHandler: RouteHandler<
	typeof getMyScales,
	AppEnv
> = async (c) => {
	const payload = c.get("jwtPayload");
	const idMembro = Number(payload.sub);
	const data = await homeDao.getScale(idMembro);
	return c.json(data, HttpStatusCode.OK);
};

export const getScaleDayHandler: RouteHandler<
	typeof getScaleDay,
	AppEnv
> = async (c) => {
	const { day } = c.req.valid("param");
	const data = await homeDao.getScaleDay(day);
	return c.json(data, HttpStatusCode.OK);
};
