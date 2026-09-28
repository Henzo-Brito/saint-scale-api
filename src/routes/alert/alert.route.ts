import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";

import {
    ReminderListSchema,
    ReminderDetailSchema,
    ReminderIdParamSchema,
} from "@/schemas/home.schemas.js";

const TAG = ["alert"];

// ------------------------------------------------------------------
// GET /alert/reminder
// ------------------------------------------------------------------
export const getReminder = createRoute({
    method: "get",
    path: "/alert/reminder",
    tags: TAG,
    security: [{ bearerAuth: [] }],
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: ReminderListSchema } },
            description: "Alertas e notificações",
        },
    },
});

// ------------------------------------------------------------------
// GET /alert/reminder/{id_reminder}
// ------------------------------------------------------------------
export const getReminderDetail = createRoute({
    method: "get",
    path: "/alert/reminder/{id_reminder}",
    tags: TAG,
    security: [{ bearerAuth: [] }],
    request: {
        params: ReminderIdParamSchema,
    },
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: ReminderDetailSchema } },
            description: "Detalhe do lembrete",
        },
    },
});
