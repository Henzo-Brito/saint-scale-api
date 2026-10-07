import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";
import { AlterBirthdaySchema, AlterEmailSchema, AlterLogradouroSchema, AlterTelephoneSchema, CreateUserSchema, ForgotPasswordSchema, MeSchema, PatchResponseSchema, UserPublicSchema, } from "@/schemas/user.schemas.js";
const SECURITY = [{ bearerAuth: [] }];
const NOT_FOUND = {
    content: {
        "application/json": { schema: z.object({ message: z.string() }) },
    },
    description: "Membro não encontrado",
};
const UNAUTHORIZED = {
    content: {
        "application/json": { schema: z.object({ message: z.string() }) },
    },
    description: "Token ausente ou inválido",
};
// ── POST / ─────────────────────────────────────────────────────
export const createUser = createRoute({
    method: "post",
    path: "/",
    tags: ["User"],
    request: {
        body: {
            content: { "application/json": { schema: CreateUserSchema } },
            description: "Dados do novo membro. birth_date em YYYY-MM-DD, telephone apenas dígitos (máx 11).",
        },
    },
    responses: {
        [HttpStatusCode.CREATED]: {
            content: { "application/json": { schema: UserPublicSchema } },
            description: "Membro criado. A senha nunca é retornada.",
        },
    },
});
// ── GET / ───────────────────────────────────────────────────────
export const getUsers = createRoute({
    method: "get",
    path: "/",
    tags: ["User"],
    security: SECURITY,
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: z.array(UserPublicSchema) } },
            description: "Lista todos os membros. A senha nunca é retornada.",
        },
        [HttpStatusCode.UNAUTHORIZED]: UNAUTHORIZED,
    },
});
// ── GET /me ─────────────────────────────────────────────────────
export const getMe = createRoute({
    method: "get",
    path: "/me",
    tags: ["User"],
    security: SECURITY,
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: MeSchema } },
            description: "Perfil completo do membro autenticado (via JWT).",
        },
        [HttpStatusCode.NOT_FOUND]: NOT_FOUND,
        [HttpStatusCode.UNAUTHORIZED]: UNAUTHORIZED,
    },
});
// ── PATCH /alterEmail ───────────────────────────────────────────
export const alterEmail = createRoute({
    method: "patch",
    path: "/alterEmail",
    tags: ["User"],
    security: SECURITY,
    request: {
        body: { content: { "application/json": { schema: AlterEmailSchema } } },
    },
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: PatchResponseSchema } },
            description: "E-mail atualizado.",
        },
        [HttpStatusCode.NOT_FOUND]: NOT_FOUND,
        [HttpStatusCode.UNAUTHORIZED]: UNAUTHORIZED,
    },
});
// ── PATCH /forgotPassword ───────────────────────────────────────
// Público: identifica o membro pelo email, não pelo JWT.
export const forgotPassword = createRoute({
    method: "patch",
    path: "/forgotPassword",
    tags: ["User"],
    request: {
        body: {
            content: { "application/json": { schema: ForgotPasswordSchema } },
            description: "Email + nova senha. Não requer autenticação.",
        },
    },
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: PatchResponseSchema } },
            description: "Senha atualizada.",
        },
        [HttpStatusCode.NOT_FOUND]: NOT_FOUND,
    },
});
// ── PATCH /alterLogradouro ──────────────────────────────────────
// Recebe rua+numero; faz upsert internamente no backend.
export const alterLogradouro = createRoute({
    method: "patch",
    path: "/alterLogradouro",
    tags: ["User"],
    security: SECURITY,
    request: {
        body: {
            content: { "application/json": { schema: AlterLogradouroSchema } },
            description: "Rua e número do novo endereço. O backend cria ou reutiliza o logradouro.",
        },
    },
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: PatchResponseSchema } },
            description: "Endereço atualizado.",
        },
        [HttpStatusCode.NOT_FOUND]: NOT_FOUND,
        [HttpStatusCode.UNAUTHORIZED]: UNAUTHORIZED,
    },
});
// ── PATCH /alterBirthday ────────────────────────────────────────
export const alterBirthday = createRoute({
    method: "patch",
    path: "/alterBirthday",
    tags: ["User"],
    security: SECURITY,
    request: {
        body: {
            content: { "application/json": { schema: AlterBirthdaySchema } },
            description: "Data de nascimento em YYYY-MM-DD.",
        },
    },
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: PatchResponseSchema } },
            description: "Data de nascimento atualizada.",
        },
        [HttpStatusCode.NOT_FOUND]: NOT_FOUND,
        [HttpStatusCode.UNAUTHORIZED]: UNAUTHORIZED,
    },
});
// ── PATCH /alterTelephone ───────────────────────────────────────
export const alterTelephone = createRoute({
    method: "patch",
    path: "/alterTelephone",
    tags: ["User"],
    security: SECURITY,
    request: {
        body: {
            content: { "application/json": { schema: AlterTelephoneSchema } },
            description: "Telefone com apenas dígitos, máx 11 chars.",
        },
    },
    responses: {
        [HttpStatusCode.OK]: {
            content: { "application/json": { schema: PatchResponseSchema } },
            description: "Telefone atualizado.",
        },
        [HttpStatusCode.NOT_FOUND]: NOT_FOUND,
        [HttpStatusCode.UNAUTHORIZED]: UNAUTHORIZED,
    },
});
