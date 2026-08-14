import * as HttpStatusCode from "stoker/http-status-codes";
import type { RouteHandling } from "@/tools/types.js";

export const createUser: RouteHandling<CreatTaskType> = async (c) => {
	const data = c.req.valid("json");
	try {
		const newTask = await createUser(data);

		c.var.logger.info("Usuário Criado com sucesso");

		return c.json(newTask, HttpStatusCode.CREATED);
	} catch (e) {
		c.var.logger.error({ e }, "Erro ao criar usuário");

		return c.json(
			{ message: "Internal Server Error" },
			HttpStatusCode.INTERNAL_SERVER_ERROR,
		);
	}
};
