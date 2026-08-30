import { z } from "@hono/zod-openapi";

const birthDateSchema = z
	.string()
	.regex(
		/^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/,
		"Birth date must be in MM-DD-YYYY format",
	);

export const UserSchema = z
	.object({
		id_member: z.number().int(),
		name: z.string().max(150).nullable(),
		register_date: z.string().datetime(),
		birth_date: birthDateSchema,
		telephone: z.string().max(11),
		email: z.string().email().max(255),
		password: z.string().min(8).max(255),
		role: z.string().max(60),
		id_function: z.number().int().nullable(),
		id_logradouro: z.number().int().nullable(),
	})
	.openapi("User");

export const CreateUserSchema = z
	.object({
		name: z.string().max(150),
		birth_date: birthDateSchema,
		telephone: z.string().max(11),
		email: z.string().email().max(255),
		password: z.string().min(8).max(60),
		role: z.string().max(60),
	})
	.openapi("CreateUser");

export type User = z.infer<typeof UserSchema>;

export type CreateUser = z.infer<typeof CreateUserSchema>;