import { HTTPException } from "hono/http-exception";
import * as HttpStatusCode from "stoker/http-status-codes";
import { alertDao } from "./alert.dao.js";
export const getReminderHandler = async (c) => {
    const payload = c.get("jwtPayload");
    const idMembro = Number(payload.sub);
    const data = await alertDao.getReminder(idMembro);
    return c.json(data, HttpStatusCode.OK);
};
export const getReminderDetailHandler = async (c) => {
    const { id_reminder } = c.req.valid("param");
    const data = await alertDao.getReminderDetail(Number(id_reminder));
    if (!data) {
        throw new HTTPException(HttpStatusCode.NOT_FOUND, {
            message: "Lembrete não encontrado",
        });
    }
    return c.json(data, HttpStatusCode.OK);
};
