import { pool } from "@/db/index.js";

export const SignInDAO = {
	async findUserByEmail(email: string) {
		const result = await pool.query(
			`
			SELECT
				id_membro AS id_member,
				email,
				senha AS password,
				cargo AS role
			FROM membros
			WHERE email = $1
			LIMIT 1
			`,
			[email],
		);

		return result.rows[0] ?? null;
	},
};