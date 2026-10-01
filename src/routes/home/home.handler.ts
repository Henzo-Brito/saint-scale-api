import type { RouteHandler } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";

import type { AppEnv } from "@/tools/createAppRoute.js";
import { homeDao } from "./home.dao.js";
import type {
    getMonth,
    getUnavailability,
    getScale,
    getScaleDay,
} from "./home.route.js";

// ------------------------------------------------------------------
// GET /home/month/{mes}
// ------------------------------------------------------------------
export const getMonthHandler: RouteHandler<typeof getMonth, AppEnv> = async (c) => {
    const { mes } = c.req.valid("param");
    const data = await homeDao.getMonth(mes);
    return c.json(data, HttpStatusCode.OK);
};

// ------------------------------------------------------------------
// GET /home/unavailability/{mes}
// ------------------------------------------------------------------
export const getUnavailabilityHandler: RouteHandler<typeof getUnavailability, AppEnv> = async (c) => {
    const { mes } = c.req.valid("param");
    const data = await homeDao.getUnavailability(mes);
    return c.json(data, HttpStatusCode.OK);
};

// ------------------------------------------------------------------
// GET /home/scale/{my_id}
// ------------------------------------------------------------------
export const getScaleHandler: RouteHandler<typeof getScale, AppEnv> = async (c) => {
    const { my_id } = c.req.valid("param");
    const data = await homeDao.getScale(Number(my_id));
    return c.json(data, HttpStatusCode.OK);
};

// ------------------------------------------------------------------
// GET /home/scale/day/{day}
// ------------------------------------------------------------------
export const getScaleDayHandler: RouteHandler<typeof getScaleDay, AppEnv> = async (c) => {
    const { day } = c.req.valid("param");
    const data = await homeDao.getScaleDay(day);
    return c.json(data, HttpStatusCode.OK);
};
