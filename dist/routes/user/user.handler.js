import * as HttpStatusCode from "stoker/http-status-codes";
import { userDao } from "./user.dao.js";
export const createUserHandler = async (c) => {
    const data = c.req.valid("json");
    const newUser = await userDao.createUser(data);
    return c.json(newUser, HttpStatusCode.CREATED);
};
export const getUsersHandler = async (c) => {
    const users = await userDao.getUsers();
    return c.json(users, HttpStatusCode.OK);
};
export const getMeHandler = async (c) => {
    const payload = c.get("jwtPayload");
    const idMember = Number(payload.sub);
    const me = await userDao.getMe(idMember);
    if (!me) {
        return c.json({ message: "Membro não encontrado" }, HttpStatusCode.NOT_FOUND);
    }
    return c.json(me, HttpStatusCode.OK);
};
export const alterEmailHandler = async (c) => {
    const data = c.req.valid("json");
    const payload = c.get("jwtPayload");
    const idMember = Number(payload.sub);
    const updated = await userDao.alterEmail(idMember, data);
    if (!updated) {
        return c.json({ message: "Membro não encontrado" }, HttpStatusCode.NOT_FOUND);
    }
    return c.json({ message: "E-mail atualizado com sucesso" }, HttpStatusCode.OK);
};
// Rota pública — sem JWT. Identifica o membro pelo email enviado no body.
export const forgotPasswordHandler = async (c) => {
    const data = c.req.valid("json");
    const updated = await userDao.forgotPassword(data);
    if (!updated) {
        return c.json({ message: "Membro não encontrado" }, HttpStatusCode.NOT_FOUND);
    }
    return c.json({ message: "Senha atualizada com sucesso" }, HttpStatusCode.OK);
};
export const alterLogradouroHandler = async (c) => {
    const data = c.req.valid("json");
    const payload = c.get("jwtPayload");
    const idMember = Number(payload.sub);
    const updated = await userDao.alterLogradouro(idMember, data);
    if (!updated) {
        return c.json({ message: "Membro não encontrado" }, HttpStatusCode.NOT_FOUND);
    }
    return c.json({ message: "Endereço atualizado com sucesso" }, HttpStatusCode.OK);
};
export const alterBirthdayHandler = async (c) => {
    const data = c.req.valid("json");
    const payload = c.get("jwtPayload");
    const idMember = Number(payload.sub);
    const updated = await userDao.alterBirthday(idMember, data);
    if (!updated) {
        return c.json({ message: "Membro não encontrado" }, HttpStatusCode.NOT_FOUND);
    }
    return c.json({ message: "Data de nascimento atualizada com sucesso" }, HttpStatusCode.OK);
};
export const alterTelephoneHandler = async (c) => {
    const data = c.req.valid("json");
    const payload = c.get("jwtPayload");
    const idMember = Number(payload.sub);
    const updated = await userDao.alterTelephone(idMember, data);
    if (!updated) {
        return c.json({ message: "Membro não encontrado" }, HttpStatusCode.NOT_FOUND);
    }
    return c.json({ message: "Telefone atualizado com sucesso" }, HttpStatusCode.OK);
};
