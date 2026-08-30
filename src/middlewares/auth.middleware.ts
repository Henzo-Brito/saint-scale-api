import { jwtVerify } from "jose";
import type { Context, Next } from "hono";
import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
	throw new Error("JWT_SECRET não está configurado");
}

const secret = new TextEncoder().encode(jwtSecret);

export const authMiddleware = async (c: Context, next: Next) => {
	const authorization = c.req.header("Authorization");

	if (!authorization) {
		return c.json(
			{
				message: "Token não informado",
			},
			401,
		);
	}

	const [type, token] = authorization.split(" ");

	if (type !== "Bearer" || !token) {
		return c.json(
			{
				message: "Token inválido",
			},
			401,
		);
	}

	try {
		const { payload } = await jwtVerify(token, secret);

		c.set("jwtPayload", payload);

		await next();
	} catch {
		return c.json(
			{
				message: "Token inválido ou expirado",
			},
			401,
		);
	}
};