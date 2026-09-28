import type { RouteHandler } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import * as HttpStatusCode from "stoker/http-status-codes";

import { alertDao } from "./alert.dao.js";
import type { getReminder, getReminderDetail } from "./alert.route.js";

// ------------------------------------------------------------------
// GET /alert/reminder
// ------------------------------------------------------------------
export const getReminderHandler: RouteHandler<typeof getReminder> = async (c) => {
    const data = await alertDao.getReminder();
    return c.json(data, HttpStatusCode.OK);
};

// ------------------------------------------------------------------
// GET /alert/reminder/{id_reminder}
// ------------------------------------------------------------------
export const getReminderDetailHandler: RouteHandler<typeof getReminderDetail> = async (c) => {
    const { id_reminder } = c.req.valid("param");
    const data = await alertDao.getReminderDetail(Number(id_reminder));

    if (!data) {
        throw new HTTPException(HttpStatusCode.NOT_FOUND, { message: "Lembrete não encontrado" });
    }

    return c.json(data, HttpStatusCode.OK);
};
