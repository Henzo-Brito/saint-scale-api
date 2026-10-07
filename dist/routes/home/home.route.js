import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";
import { DayParamSchema, MonthParamSchema, MonthSchema, ScaleDaySchema, ScaleSchema, UnavailabilitySchema, } from "@/schemas/home.schemas.js";
const TAG = ["home"];
const SECURITY = [{ bearerAuth: [] }];
// ──────────────────────────────────────────────────────────────────
// GET /home/month/{mes}
// ──────────────────────────────────────────────────────────────────
export const getMonth = createRoute({
    method: "get",
    path: "/home/month/{mes}",
    tags: TAG,
    security: SECURITY,
    request: {
        params: MonthParamSchema,
    },
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: MonthSchema } },
            description: "Escalas do mês selecionado.",
        },
    },
});
// ──────────────────────────────────────────────────────────────────
// GET /home/unavailability/{mes}
// ──────────────────────────────────────────────────────────────────
export const getUnavailability = createRoute({
    method: "get",
    path: "/home/unavailability/{mes}",
    tags: TAG,
    security: SECURITY,
    request: {
        params: MonthParamSchema,
    },
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: UnavailabilitySchema } },
            description: "Membros indisponíveis no mês.",
        },
    },
});
// ──────────────────────────────────────────────────────────────────
// GET /home/scale/me  — minhas escalas (ID extraído do JWT)
// Não recebe parâmetro — usa sub do token para evitar IDOR.
// ──────────────────────────────────────────────────────────────────
export const getMyScales = createRoute({
    method: "get",
    path: "/home/scale/me",
    tags: TAG,
    security: SECURITY,
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: ScaleSchema } },
            description: "Escalas do membro autenticado.",
        },
    },
});
// ──────────────────────────────────────────────────────────────────
// GET /home/scale/day/{day}  — escalas de um dia específico
// Parâmetro: DDMMYYYY  ex: "14112026"
// ──────────────────────────────────────────────────────────────────
export const getScaleDay = createRoute({
    method: "get",
    path: "/home/scale/day/{day}",
    tags: TAG,
    security: SECURITY,
    request: {
        params: DayParamSchema,
    },
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: ScaleDaySchema } },
            description: "Escalas do dia selecionado.",
        },
    },
});
