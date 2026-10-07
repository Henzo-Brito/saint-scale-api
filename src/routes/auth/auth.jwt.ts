import { SignJWT } from "jose";
import "dotenv/config";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export type JWTPayloadInput = {
	sub: string;
	email: string;
	role: string;
};

/** Cria um access token JWT assinado com HS256, expiração de 1 hora. */
export async function createAccessToken(
	payload: JWTPayloadInput,
): Promise<string> {
	return new SignJWT({ email: payload.email, role: payload.role })
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(payload.sub)
		.setIssuedAt()
		.setExpirationTime("1h")
		.sign(secret);
}
