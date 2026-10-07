import argon2 from "argon2";
import { SignInDAO } from "./auth.dao.js";
import { createAccessToken } from "./auth.jwt.js";
export const signIn = async (data) => {
    const user = await SignInDAO.findUserByEmail(data.email);
    if (!user) {
        return null;
    }
    const passwordValid = await argon2.verify(user.password, data.password);
    if (!passwordValid) {
        return null;
    }
    const accessToken = await createAccessToken({
        sub: String(user.id_member),
        email: user.email,
        role: user.role,
    });
    return { accessToken };
};
