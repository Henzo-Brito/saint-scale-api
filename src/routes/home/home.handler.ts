import type { RouteHandler } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";

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
export const getMonthHandler: RouteHandler<typeof getMonth> = async (c) => {
    const { mes } = c.req.valid("param");
    const data = await homeDao.getMonth(mes);
    return c.json(data, HttpStatusCode.OK);
};

// ------------------------------------------------------------------
// GET /home/unavailability/{mes}
// ------------------------------------------------------------------
export const getUnavailabilityHandler: RouteHandler<typeof getUnavailability> = async (c) => {
    const { mes } = c.req.valid("param");
    const data = await homeDao.getUnavailability(mes);
    return c.json(data, HttpStatusCode.OK);
};

// ------------------------------------------------------------------
// GET /home/scale/{my_id}
// ------------------------------------------------------------------
export const getScaleHandler: RouteHandler<typeof getScale> = async (c) => {
    const { my_id } = c.req.valid("param");
    const data = await homeDao.getScale(Number(my_id));
    return c.json(data, HttpStatusCode.OK);
};

// ------------------------------------------------------------------
// GET /home/scale/day/{day}
// ------------------------------------------------------------------
export const getScaleDayHandler: RouteHandler<typeof getScaleDay> = async (c) => {
    const { day } = c.req.valid("param");
    const data = await homeDao.getScaleDay(day);
    return c.json(data, HttpStatusCode.OK);
};
