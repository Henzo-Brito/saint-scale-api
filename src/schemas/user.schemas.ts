import { z } from "@hono/zod-openapi";

const birthDateSchema = z
	.string()
	.regex(
		/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/,
		"Birth date must be in MM-DD-YYYY format",
	);

export const UserSchema = z
	.object({
		id_member:     z.number().int(),
		name:          z.string().max(150),
		register_date: z.string().datetime(),
		birth_date:    birthDateSchema.nullable(),
		telephone:     z.string().max(11).nullable(),
		email:         z.string().email().max(255),
		password:      z.string().min(8).max(255),
		role:          z.string().max(60),
		id_function:   z.number().int().nullable(),
		id_logradouro: z.number().int().nullable(),
	})
	.openapi("User");

export const CreateUserSchema = z
	.object({
		name:       z.string().max(150),
		birth_date: birthDateSchema,
		telephone:  z.string().max(11),
		email:      z.string().email().max(255),
		password:   z.string().min(8).max(60),
		role:       z.string().max(60),
	})
	.openapi("CreateUser");

// ── GET /me ──────────────────────────────────────────────────────

export const LogradouroSchema = z
	.object({
		rua:    z.string(),
		numero: z.number().int(),
	})
	.openapi("Logradouro");

export const EquipeItemSchema = z
	.object({
		img_id:     z.string().nullable(),
		title:      z.string(),
		quant_part: z.number().int(),
	})
	.openapi("EquipeItem");

export const MeSchema = z
	.object({
		id_membro:       z.number().int(),
		nome:            z.string(),
		email:           z.string().email(),
		img_id:          z.string().nullable(),
		cargo:           z.string(),
		funcoes:         z.array(z.string()),
		data_nascimento: birthDateSchema.nullable(),
		telefone:        z.string().max(11).nullable(),
		logradouro:      LogradouroSchema.nullable(),
		equipes:         z.array(EquipeItemSchema),
		data_registro:   z.string().datetime(),
	})
	.openapi("Me");

export type Me           = z.infer<typeof MeSchema>;
export type LogradouroT  = z.infer<typeof LogradouroSchema>;
export type EquipeItem   = z.infer<typeof EquipeItemSchema>;

// ── PATCH schemas ────────────────────────────────────────────────

export const AlterEmailSchema = z
	.object({
		id_member: z.number().int(),
		email:     z.string().email().max(255),
	})
	.openapi("AlterEmail");

export const ForgotPasswordSchema = z
	.object({
		id_member: z.number().int(),
		password:  z.string().min(8).max(60),
	})
	.openapi("ForgotPassword");

export const AlterLogradouroSchema = z
	.object({
		id_member:     z.number().int(),
		id_logradouro: z.number().int(),
	})
	.openapi("AlterLogradouro");

export const AlterBirthdaySchema = z
	.object({
		id_member:  z.number().int(),
		birth_date: birthDateSchema,
	})
	.openapi("AlterBirthday");

export const AlterTelephoneSchema = z
	.object({
		id_member: z.number().int(),
		telephone: z.string().max(11),
	})
	.openapi("AlterTelephone");

// Resposta genérica para os PATCHes
export const PatchResponseSchema = z
	.object({
		message: z.string(),
	})
	.openapi("PatchResponse");

// ── Types ────────────────────────────────────────────────────────

export type User              = z.infer<typeof UserSchema>;
export type CreateUser        = z.infer<typeof CreateUserSchema>;
export type AlterEmail        = z.infer<typeof AlterEmailSchema>;
export type ForgotPassword    = z.infer<typeof ForgotPasswordSchema>;
export type AlterLogradouro   = z.infer<typeof AlterLogradouroSchema>;
export type AlterBirthday     = z.infer<typeof AlterBirthdaySchema>;
export type AlterTelephone    = z.infer<typeof AlterTelephoneSchema>;
