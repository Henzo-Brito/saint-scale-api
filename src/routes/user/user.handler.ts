import type { RouteHandler } from "@hono/zod-openapi";
import * as HttpStatusCode from "stoker/http-status-codes";

import type { AppEnv } from "@/tools/createAppRoute.js";
import { userDao } from "./user.dao.js";
import type {
	alterBirthday,
	alterEmail,
	alterLogradouro,
	alterTelephone,
	createUser,
	forgotPassword,
	getMe,
	getUsers,
} from "./user.route.js";

export const createUserHandler: RouteHandler<
	typeof createUser,
	AppEnv
> = async (c) => {
	const data = c.req.valid("json");
	const newUser = await userDao.createUser(data);
	return c.json(newUser, HttpStatusCode.CREATED);
};

export const getUsersHandler: RouteHandler<typeof getUsers, AppEnv> = async (
	c,
) => {
	const users = await userDao.getUsers();
	return c.json(users, HttpStatusCode.OK);
};

export const getMeHandler: RouteHandler<typeof getMe, AppEnv> = async (c) => {
	const payload = c.get("jwtPayload");
	const idMember = Number(payload.sub);

	const me = await userDao.getMe(idMember);
	if (!me) {
		return c.json(
			{ message: "Membro não encontrado" },
			HttpStatusCode.NOT_FOUND,
		);
	}
	return c.json(me, HttpStatusCode.OK);
};

export const alterEmailHandler: RouteHandler<
	typeof alterEmail,
	AppEnv
> = async (c) => {
	const data = c.req.valid("json");
	const payload = c.get("jwtPayload");
	const idMember = Number(payload.sub);

	const updated = await userDao.alterEmail(idMember, data);
	if (!updated) {
		return c.json(
			{ message: "Membro não encontrado" },
			HttpStatusCode.NOT_FOUND,
		);
	}
	return c.json(
		{ message: "E-mail atualizado com sucesso" },
		HttpStatusCode.OK,
	);
};

// Rota pública — sem JWT. Identifica o membro pelo email enviado no body.
export const forgotPasswordHandler: RouteHandler<
	typeof forgotPassword,
	AppEnv
> = async (c) => {
	const data = c.req.valid("json");
	const updated = await userDao.forgotPassword(data);
	if (!updated) {
		return c.json(
			{ message: "Membro não encontrado" },
			HttpStatusCode.NOT_FOUND,
		);
	}
	return c.json({ message: "Senha atualizada com sucesso" }, HttpStatusCode.OK);
};

export const alterLogradouroHandler: RouteHandler<
	typeof alterLogradouro,
	AppEnv
> = async (c) => {
	const data = c.req.valid("json");
	const payload = c.get("jwtPayload");
	const idMember = Number(payload.sub);

	const updated = await userDao.alterLogradouro(idMember, data);
	if (!updated) {
		return c.json(
			{ message: "Membro não encontrado" },
			HttpStatusCode.NOT_FOUND,
		);
	}
	return c.json(
		{ message: "Endereço atualizado com sucesso" },
		HttpStatusCode.OK,
	);
};

export const alterBirthdayHandler: RouteHandler<
	typeof alterBirthday,
	AppEnv
> = async (c) => {
	const data = c.req.valid("json");
	const payload = c.get("jwtPayload");
	const idMember = Number(payload.sub);

	const updated = await userDao.alterBirthday(idMember, data);
	if (!updated) {
		return c.json(
			{ message: "Membro não encontrado" },
			HttpStatusCode.NOT_FOUND,
		);
	}
	return c.json(
		{ message: "Data de nascimento atualizada com sucesso" },
		HttpStatusCode.OK,
	);
};

export const alterTelephoneHandler: RouteHandler<
	typeof alterTelephone,
	AppEnv
> = async (c) => {
	const data = c.req.valid("json");
	const payload = c.get("jwtPayload");
	const idMember = Number(payload.sub);

	const updated = await userDao.alterTelephone(idMember, data);
	if (!updated) {
		return c.json(
			{ message: "Membro não encontrado" },
			HttpStatusCode.NOT_FOUND,
		);
	}
	return c.json(
		{ message: "Telefone atualizado com sucesso" },
		HttpStatusCode.OK,
	);
};
