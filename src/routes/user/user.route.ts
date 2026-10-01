import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";

import {
	CreateUserSchema,
	UserSchema,
	MeSchema,
	AlterEmailSchema,
	ForgotPasswordSchema,
	AlterLogradouroSchema,
	AlterBirthdaySchema,
	AlterTelephoneSchema,
	PatchResponseSchema,
} from "@/schemas/user.schemas.js";

const SECURITY = [{ bearerAuth: [] }];
const NOT_FOUND_RESPONSE = {
	content: { "application/json": { schema: z.object({ message: z.string() }) } },
	description: "Membro não encontrado",
} as const;

// ── POST / ───────────────────────────────────────────────────────

export const createUser = createRoute({
	method: "post",
	path: "/",
	tags: ["User"],
	request: {
		body: {
			content: {
				"application/json": { schema: CreateUserSchema },
			},
		},
	},
	responses: {
		[HttpStatusCode.OK]: {
			content: { "application/json": { schema: UserSchema } },
			description: "Creates a new user successfully",
		},
	},
});

// ── GET / ────────────────────────────────────────────────────────

export const getUser = createRoute({
	method: "get",
	path: "/",
	tags: ["User"],
	security: SECURITY,
	responses: {
		[HttpStatusCode.OK]: {
			content: { "application/json": { schema: z.array(UserSchema) } },
			description: "Gets all users successfully",
		},
	},
});

// ── GET /me ──────────────────────────────────────────────────────

export const getMe = createRoute({
	method: "get",
	path: "/me",
	tags: ["User"],
	security: SECURITY,
	responses: {
		[HttpStatusCode.OK]: {
			content: { "application/json": { schema: MeSchema } },
			description: "Retorna o perfil completo do membro autenticado",
		},
		[HttpStatusCode.NOT_FOUND]: {
			content: { "application/json": { schema: z.object({ message: z.string() }) } },
			description: "Membro não encontrado",
		},
	},
});

// ── PATCH /alterEmail ────────────────────────────────────────────

export const alterEmail = createRoute({
	method: "patch",
	path: "/alterEmail",
	tags: ["User"],
	security: SECURITY,
	request: {
		body: {
			content: {
				"application/json": { schema: AlterEmailSchema },
			},
		},
	},
	responses: {
		[HttpStatusCode.OK]: {
			content: { "application/json": { schema: PatchResponseSchema } },
			description: "Altera o e-mail do membro",
		},
		[HttpStatusCode.NOT_FOUND]: NOT_FOUND_RESPONSE,
	},
});

// ── PATCH /forgotPassword ────────────────────────────────────────

export const forgotPassword = createRoute({
	method: "patch",
	path: "/forgotPassword",
	tags: ["User"],
	security: SECURITY,
	request: {
		body: {
			content: {
				"application/json": { schema: ForgotPasswordSchema },
			},
		},
	},
	responses: {
		[HttpStatusCode.OK]: {
			content: { "application/json": { schema: PatchResponseSchema } },
			description: "Altera a senha do membro",
		},
		[HttpStatusCode.NOT_FOUND]: NOT_FOUND_RESPONSE,
	},
});

// ── PATCH /alterLogradouro ───────────────────────────────────────

export const alterLogradouro = createRoute({
	method: "patch",
	path: "/alterLogradouro",
	tags: ["User"],
	security: SECURITY,
	request: {
		body: {
			content: {
				"application/json": { schema: AlterLogradouroSchema },
			},
		},
	},
	responses: {
		[HttpStatusCode.OK]: {
			content: { "application/json": { schema: PatchResponseSchema } },
			description: "Altera o logradouro do membro",
		},
		[HttpStatusCode.NOT_FOUND]: NOT_FOUND_RESPONSE,
	},
});

// ── PATCH /alterBirthday ─────────────────────────────────────────

export const alterBirthday = createRoute({
	method: "patch",
	path: "/alterBirthday",
	tags: ["User"],
	security: SECURITY,
	request: {
		body: {
			content: {
				"application/json": { schema: AlterBirthdaySchema },
			},
		},
	},
	responses: {
		[HttpStatusCode.OK]: {
			content: { "application/json": { schema: PatchResponseSchema } },
			description: "Altera a data de nascimento do membro",
		},
		[HttpStatusCode.NOT_FOUND]: NOT_FOUND_RESPONSE,
	},
});

// ── PATCH /alterTelephone ────────────────────────────────────────

export const alterTelephone = createRoute({
	method: "patch",
	path: "/alterTelephone",
	tags: ["User"],
	security: SECURITY,
	request: {
		body: {
			content: {
				"application/json": { schema: AlterTelephoneSchema },
			},
		},
	},
	responses: {
		[HttpStatusCode.OK]: {
			content: { "application/json": { schema: PatchResponseSchema } },
			description: "Altera o telefone do membro",
		},
		[HttpStatusCode.NOT_FOUND]: NOT_FOUND_RESPONSE,
	},
});
