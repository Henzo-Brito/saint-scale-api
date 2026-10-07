import * as HttpStatusCode from "stoker/http-status-codes";
import { homeDao } from "./home.dao.js";
export const getMonthHandler = async (c) => {
    const { mes } = c.req.valid("param");
    const data = await homeDao.getMonth(mes);
    return c.json(data, HttpStatusCode.OK);
};
export const getUnavailabilityHandler = async (c) => {
    const { mes } = c.req.valid("param");
    const data = await homeDao.getUnavailability(mes);
    return c.json(data, HttpStatusCode.OK);
};
// ID do membro extraído do JWT — sem parâmetro de URL.
export const getMyScalesHandler = async (c) => {
    const payload = c.get("jwtPayload");
    const idMembro = Number(payload.sub);
    const data = await homeDao.getScale(idMembro);
    return c.json(data, HttpStatusCode.OK);
};
export const getScaleDayHandler = async (c) => {
    const { day } = c.req.valid("param");
    const data = await homeDao.getScaleDay(day);
    return c.json(data, HttpStatusCode.OK);
};
