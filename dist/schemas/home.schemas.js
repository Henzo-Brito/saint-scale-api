import { z } from "@hono/zod-openapi";
// ──────────────────────────────────────────────────────────────────
// GET /home/month/{mes}
// ──────────────────────────────────────────────────────────────────
export const MonthItemSchema = z
    .object({
    id_escala: z.string().openapi({ example: "1" }),
    dia: z.string().openapi({ example: "14/11/2026" }),
})
    .openapi("MonthItem");
export const MonthSchema = z.array(MonthItemSchema).openapi("Month");
// ──────────────────────────────────────────────────────────────────
// GET /home/unavailability/{mes}
// ──────────────────────────────────────────────────────────────────
export const UnavailabilityItemSchema = z
    .object({
    id_escala: z.string().openapi({ example: "1" }),
    nome: z.string().openapi({ example: "João" }),
    funcao: z.string().openapi({ example: "guitarrista" }),
    img_id: z.string().openapi({ example: "img_001" }),
    dia: z.string().openapi({ example: "14/11/2026" }),
})
    .openapi("UnavailabilityItem");
export const UnavailabilitySchema = z
    .array(UnavailabilityItemSchema)
    .openapi("Unavailability");
// ──────────────────────────────────────────────────────────────────
// GET /home/scale/me  — minhas escalas
// ──────────────────────────────────────────────────────────────────
export const ScaleItemSchema = z
    .object({
    id_escala: z.string().openapi({ example: "1" }),
    confirmados: z.number().int().openapi({ example: 3 }),
    title_scale: z.string().openapi({ example: "Mavi" }),
    funcao: z.string().openapi({ example: "guitarrista" }),
    img_id: z.array(z.string()).openapi({ example: ["img_001", "img_002"] }),
    quant_music: z.number().int().openapi({ example: 3 }),
    data_hora: z.string().openapi({ example: "14/11/2026 19:00:00" }),
    dia: z.string().openapi({ example: "14/11/2026" }),
})
    .openapi("ScaleItem");
export const ScaleSchema = z.array(ScaleItemSchema).openapi("Scale");
// ──────────────────────────────────────────────────────────────────
// GET /home/scale/day/{day}  — escalas do dia
// ──────────────────────────────────────────────────────────────────
export const ScaleDayItemSchema = z
    .object({
    id_escala: z.string().openapi({ example: "1" }),
    confirmados: z.number().int().openapi({ example: 3 }),
    nome_escala: z.string().openapi({ example: "Culto Dominical" }),
    img_id: z.array(z.string()).openapi({ example: ["img_001", "img_002"] }),
    quant_music: z.number().int().openapi({ example: 3 }),
    data_hora: z.string().openapi({ example: "14/11/2026 19:00:00" }),
    dia: z.string().openapi({ example: "14/11/2026" }),
})
    .openapi("ScaleDayItem");
export const ScaleDaySchema = z.array(ScaleDayItemSchema).openapi("ScaleDay");
// ──────────────────────────────────────────────────────────────────
// GET /alert/reminder  — lista de lembretes + notificações
// ──────────────────────────────────────────────────────────────────
export const AlertItemSchema = z
    .object({
    // id_lembrete — corrigido de "id_escala" que era semanticamente incorreto
    id_lembrete: z.string().openapi({ example: "1" }),
    name: z.string().openapi({ example: "ALERTA Ensaio" }),
    date: z.string().openapi({ example: "02/12/2026" }),
    functions: z
        .array(z.string())
        .openapi({ example: ["guitarristas", "bateristas"] }),
})
    .openapi("AlertItem");
export const NotificationItemSchema = z
    .object({
    id_notification: z.string().openapi({ example: "1" }),
    title: z.string().openapi({ example: "Confirmação pendente" }),
    conteudo: z
        .string()
        .nullable()
        .openapi({ example: "Você tem uma escala pendente." }),
    date: z.string().openapi({ example: "14/11/2026" }),
})
    .openapi("NotificationItem");
export const ReminderListSchema = z
    .object({
    alert: z.array(AlertItemSchema),
    notifications: z.array(NotificationItemSchema),
})
    .openapi("ReminderList");
// ──────────────────────────────────────────────────────────────────
// GET /alert/reminder/{id_reminder}  — detalhe de um lembrete
// ──────────────────────────────────────────────────────────────────
export const ReminderDetailSchema = z
    .object({
    id_lembrete: z.string().openapi({ example: "1" }),
    name: z.string().openapi({ example: "ALERTA Ensaio" }),
    date: z.string().openapi({ example: "02/12/2026" }),
    tempo: z.string().openapi({ example: "10:20" }),
    description: z
        .string()
        .openapi({ example: "Ensaio antes do culto. Levar instrumentos." }),
    functions: z
        .array(z.string())
        .openapi({ example: ["guitarristas", "bateristas"] }),
})
    .openapi("ReminderDetail");
// ──────────────────────────────────────────────────────────────────
// Params
// ──────────────────────────────────────────────────────────────────
export const MonthParamSchema = z.object({
    mes: z.enum([
        "janeiro",
        "fevereiro",
        "marco",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro",
    ]),
});
export const DayParamSchema = z.object({
    day: z
        .string()
        .regex(/^\d{8}$/, "Day must be in DDMMYYYY format")
        .openapi({ example: "14112026" }),
});
export const ReminderIdParamSchema = z.object({
    id_reminder: z.string(),
});
