import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";

import {
    MonthSchema,
    MonthParamSchema,
    UnavailabilitySchema,
    ScaleSchema,
    MyIdParamSchema,
    ScaleDaySchema,
    DayParamSchema,
} from "@/schemas/home.schemas.js";

const TAG = ["home"];

// ------------------------------------------------------------------
// GET /home/month/{mes}
// ------------------------------------------------------------------
export const getMonth = createRoute({
    method: "get",
    path: "/home/month/{mes}",
    tags: TAG,
    security: [{ bearerAuth: [] }],
    request: {
        params: MonthParamSchema,
    },
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: MonthSchema } },
            description: "Escalas do mês selecionado",
        },
    },
});

// ------------------------------------------------------------------
// GET /home/unavailability/{mes}
// ------------------------------------------------------------------
export const getUnavailability = createRoute({
    method: "get",
    path: "/home/unavailability/{mes}",
    tags: TAG,
    security: [{ bearerAuth: [] }],
    request: {
        params: MonthParamSchema,
    },
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: UnavailabilitySchema } },
            description: "Membros indisponíveis no mês",
        },
    },
});

// ------------------------------------------------------------------
// GET /home/scale/{my_id}  — minhas escalas
// ------------------------------------------------------------------
export const getScale = createRoute({
    method: "get",
    path: "/home/scale/{my_id}",
    tags: TAG,
    security: [{ bearerAuth: [] }],
    request: {
        params: MyIdParamSchema,
    },
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: ScaleSchema } },
            description: "Escalas do membro autenticado",
        },
    },
});

// ------------------------------------------------------------------
// GET /home/scale/day/{day}  — escalas de um dia específico
// ------------------------------------------------------------------
export const getScaleDay = createRoute({
    method: "get",
    path: "/home/scale/day/{day}",
    tags: TAG,
    security: [{ bearerAuth: [] }],
    request: {
        params: DayParamSchema,
    },
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: ScaleDaySchema } },
            description: "Escalas do dia selecionado",
        },
    },
});

