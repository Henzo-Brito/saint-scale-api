import argon2 from "argon2";
import { SignJWT } from "jose";

import type { SignIn } from "@/schemas/auth.schemas.js";
import { SignInDAO } from "./auth.dao.js";

const secret = new TextEncoder().encode(
	process.env.JWT_SECRET,
);

export const signIn = async (data: SignIn) => {
	const user = await SignInDAO.findUserByEmail(data.email);

	if (!user) {
		return null;
	}

	const passwordValid = await argon2.verify(
		user.password,
		data.password,
	);

	if (!passwordValid) {
		return null;
	}

	const accessToken = await new SignJWT({
		email: user.email,
		role: user.role,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(String(user.id_member))
		.setIssuedAt()
		.setExpirationTime("1h")
		.sign(secret);

	return {
		accessToken,
	};
};