import { signIn } from "./auth.service.js";
export const loginHandler = async (c) => {
    const data = c.req.valid("json");
    const result = await signIn(data);
    if (!result) {
        return c.json({
            message: "Email ou senha inválidos",
        }, 401);
    }
    return c.json({
        accessToken: result.accessToken,
        tokenType: "Bearer",
    }, 200);
};
