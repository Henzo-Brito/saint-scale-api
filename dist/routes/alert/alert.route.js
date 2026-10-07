import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";
import { ReminderDetailSchema, ReminderIdParamSchema, ReminderListSchema, } from "@/schemas/home.schemas.js";
const TAG = ["alert"];
const SECURITY = [{ bearerAuth: [] }];
const NOT_FOUND = {
    content: {
        "application/json": { schema: z.object({ message: z.string() }) },
    },
    description: "Lembrete não encontrado",
};
// ──────────────────────────────────────────────────────────────────
// GET /alert/reminder
// Alertas visíveis a todos; notificações filtradas pelo membro logado.
// ──────────────────────────────────────────────────────────────────
export const getReminder = createRoute({
    method: "get",
    path: "/alert/reminder",
    tags: TAG,
    security: SECURITY,
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: ReminderListSchema } },
            description: "Alertas (todos) e notificações (do membro autenticado).",
        },
    },
});
// ──────────────────────────────────────────────────────────────────
// GET /alert/reminder/{id_reminder}
// ──────────────────────────────────────────────────────────────────
export const getReminderDetail = createRoute({
    method: "get",
    path: "/alert/reminder/{id_reminder}",
    tags: TAG,
    security: SECURITY,
    request: {
        params: ReminderIdParamSchema,
    },
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: ReminderDetailSchema } },
            description: "Detalhe do lembrete.",
        },
        [HttpStatusCode.NOT_FOUND]: NOT_FOUND,
    },
});
