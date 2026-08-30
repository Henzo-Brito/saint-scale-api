import { z } from "@hono/zod-openapi";

export const SignInSchema = z
	.object({
		email: z.email().max(100),
		password: z.string().min(8).max(255),
	})
	.openapi("SignIn");

export const JWTSchema = z
	.object({
		accessToken: z.string(),
		tokenType: z.literal("Bearer"),
	})
	.openapi("JWT");

export const UNAUTHORIZEDSchema = z
	.object({
		message: z.string(),
	})
	.openapi("Unauthorized");

export type SignIn = z.infer<typeof SignInSchema>;
export type JWT = z.infer<typeof JWTSchema>;
export type UNAUTHORIZED = z.infer<typeof UNAUTHORIZEDSchema>;
