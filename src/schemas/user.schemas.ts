import { z } from "@hono/zod-openapi";

// ── Formato de data ─────────────────────────────────────────────
// A API usa ISO YYYY-MM-DD tanto em input quanto em output.
// O frontend é responsável por formatar para exibição (DD/MM/YYYY).
const birthDateSchema = z
	.string()
	.regex(
		/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
		"Birth date must be in YYYY-MM-DD format",
	);

// ── UserPublicSchema — retorno sem senha ─────────────────────────
// Usado em GET / e POST /. A senha nunca é exposta na API.
export const UserPublicSchema = z
	.object({
		id_member: z.number().int(),
		name: z.string().max(150),
		register_date: z.string().datetime(),
		birth_date: birthDateSchema.nullable(),
		telephone: z.string().max(11).nullable(),
		email: z.string().email().max(255),
		role: z.string().max(60),
		id_logradouro: z.number().int().nullable(),
	})
	.openapi("UserPublic");

export const CreateUserSchema = z
	.object({
		name: z.string().max(150),
		birth_date: birthDateSchema,
		telephone: z.string().max(11),
		email: z.string().email().max(255),
		password: z.string().min(8).max(60),
	})
	.openapi("CreateUser");

// ── GET /me ──────────────────────────────────────────────────────

export const LogradouroSchema = z
	.object({
		rua: z.string(),
		numero: z.number().int(),
	})
	.openapi("Logradouro");

export const EquipeItemSchema = z
	.object({
		img_id: z.string().nullable(),
		title: z.string(),
		quant_part: z.number().int(),
	})
	.openapi("EquipeItem");

export const MeSchema = z
	.object({
		id_membro: z.number().int(),
		nome: z.string(),
		email: z.string().email(),
		img_id: z.string().nullable(),
		cargo: z.string(),
		funcoes: z.array(z.string()),
		data_nascimento: birthDateSchema.nullable(),
		telefone: z.string().max(11).nullable(),
		logradouro: LogradouroSchema.nullable(),
		equipes: z.array(EquipeItemSchema),
		data_registro: z.string().datetime(),
	})
	.openapi("Me");

export type Me = z.infer<typeof MeSchema>;
export type LogradouroT = z.infer<typeof LogradouroSchema>;
export type EquipeItem = z.infer<typeof EquipeItemSchema>;

// ── PATCH schemas ────────────────────────────────────────────────

export const AlterEmailSchema = z
	.object({
		email: z.string().email().max(255),
	})
	.openapi("AlterEmail");

// Identificação por email — endpoint é público (usuário não consegue logar)
export const ForgotPasswordSchema = z
	.object({
		email: z.string().email().max(255),
		password: z.string().min(8).max(60),
	})
	.openapi("ForgotPassword");

// Recebe rua+numero e faz upsert do logradouro internamente
export const AlterLogradouroSchema = z
	.object({
		rua: z.string().max(255),
		numero: z.number().int().positive(),
	})
	.openapi("AlterLogradouro");

export const AlterBirthdaySchema = z
	.object({
		birth_date: birthDateSchema,
	})
	.openapi("AlterBirthday");

export const AlterTelephoneSchema = z
	.object({
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

export type UserPublic = z.infer<typeof UserPublicSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type AlterEmail = z.infer<typeof AlterEmailSchema>;
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;
export type AlterLogradouro = z.infer<typeof AlterLogradouroSchema>;
export type AlterBirthday = z.infer<typeof AlterBirthdaySchema>;
export type AlterTelephone = z.infer<typeof AlterTelephoneSchema>;
