import type { RouteHandler } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";

import type { AppEnv } from "@/tools/createAppRoute.js";
import {
	createUser,
	getUser,
	getMe,
	alterEmail,
	forgotPassword,
	alterLogradouro,
	alterBirthday,
	alterTelephone,
} from "./user.route.js";
import { userDao } from "./user.dao.js";

export const createUserHandler: RouteHandler<typeof createUser, AppEnv> = async (c) => {
	const data = c.req.valid("json");
	const newUser = await userDao.createUser(data);
	return c.json(newUser);
};

export const getUserHandler: RouteHandler<typeof getUser, AppEnv> = async (c) => {
	const users = await userDao.getUsers();
	return c.json(users);
};

export const getMeHandler: RouteHandler<typeof getMe, AppEnv> = async (c) => {
	// JWT sub contains the id_membro set at sign-in
	const payload = c.get("jwtPayload");
	const idMember = Number(payload.sub);

	const me = await userDao.getMe(idMember);
	if (!me) {
		return c.json({ message: "Membro não encontrado" }, HttpStatusCode.NOT_FOUND);
	}
	return c.json(me, HttpStatusCode.OK);
};

export const alterEmailHandler: RouteHandler<typeof alterEmail, AppEnv> = async (c) => {
	const data = c.req.valid("json");
	const updated = await userDao.alterEmail(data);
	if (!updated) {
		return c.json({ message: "Membro não encontrado" }, HttpStatusCode.NOT_FOUND);
	}
	return c.json({ message: "E-mail atualizado com sucesso" });
};

export const forgotPasswordHandler: RouteHandler<typeof forgotPassword, AppEnv> = async (c) => {
	const data = c.req.valid("json");
	const updated = await userDao.forgotPassword(data);
	if (!updated) {
		return c.json({ message: "Membro não encontrado" }, HttpStatusCode.NOT_FOUND);
	}
	return c.json({ message: "Senha atualizada com sucesso" });
};

export const alterLogradouroHandler: RouteHandler<typeof alterLogradouro, AppEnv> = async (c) => {
	const data = c.req.valid("json");
	const updated = await userDao.alterLogradouro(data);
	if (!updated) {
		return c.json({ message: "Membro não encontrado" }, HttpStatusCode.NOT_FOUND);
	}
	return c.json({ message: "Logradouro atualizado com sucesso" });
};

export const alterBirthdayHandler: RouteHandler<typeof alterBirthday, AppEnv> = async (c) => {
	const data = c.req.valid("json");
	const updated = await userDao.alterBirthday(data);
	if (!updated) {
		return c.json({ message: "Membro não encontrado" }, HttpStatusCode.NOT_FOUND);
	}
	return c.json({ message: "Data de nascimento atualizada com sucesso" });
};

export const alterTelephoneHandler: RouteHandler<typeof alterTelephone, AppEnv> = async (c) => {
	const data = c.req.valid("json");
	const updated = await userDao.alterTelephone(data);
	if (!updated) {
		return c.json({ message: "Membro não encontrado" }, HttpStatusCode.NOT_FOUND);
	}
	return c.json({ message: "Telefone atualizado com sucesso" });
};
