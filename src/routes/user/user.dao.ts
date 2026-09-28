import argon2 from "argon2";
import type { User, CreateUser } from "@/schemas/user.schemas.js";
import { pool } from "@/db/index.js";

// PostgreSQL returns DATE as a JS Date object; convert to MM-DD-YYYY string
function formatBirthDate(raw: Date | string | null): string | null {
	if (!raw) return null;
	const d = raw instanceof Date ? raw : new Date(raw);
	const month = String(d.getUTCMonth() + 1).padStart(2, "0");
	const day   = String(d.getUTCDate()).padStart(2, "0");
	const year  = d.getUTCFullYear();
	return `${month}-${day}-${year}`;
}

function mapRow(row: Record<string, unknown>): User {
	return {
		...row,
		birth_date:    formatBirthDate(row.birth_date as Date | string | null),
		register_date: row.register_date instanceof Date
			? row.register_date.toISOString()
			: String(row.register_date),
	} as User;
}

export const userDao = {
	async createUser(user: CreateUser): Promise<User> {
		// Input is MM-DD-YYYY; convert to ISO YYYY-MM-DD for PostgreSQL
		const [month, day, year] = user.birth_date.split("-");
		const birthDate = `${year}-${month}-${day}`;

		const hashedPassword = await argon2.hash(user.password, {
			type: argon2.argon2id,
		});

		const result = await pool.query(
			`
			INSERT INTO membros (
				nome,
				data_nascimento,
				telefone,
				email,
				senha,
				cargo,
				id_funcao_fk,
				id_logradouro_fk
			)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			RETURNING
				id_membro        AS id_member,
				nome             AS name,
				data_registro    AS register_date,
				data_nascimento  AS birth_date,
				telefone         AS telephone,
				email,
				senha            AS password,
				cargo            AS role,
				id_funcao_fk     AS id_function,
				id_logradouro_fk AS id_logradouro
			`,
			[
				user.name,
				birthDate,
				user.telephone,
				user.email,
				hashedPassword,
				"membro",
				null,
				null,
			],
		);

		return mapRow(result.rows[0]);
	},

	async getUsers(): Promise<User[]> {
		const result = await pool.query(`
			SELECT
				id_membro        AS id_member,
				nome             AS name,
				data_registro    AS register_date,
				data_nascimento  AS birth_date,
				telefone         AS telephone,
				email,
				senha            AS password,
				cargo            AS role,
				id_funcao_fk     AS id_function,
				id_logradouro_fk AS id_logradouro
			FROM membros
		`);

		return result.rows.map(mapRow);
	},

	async getUserByEmail(email: string): Promise<User | null> {
		const result = await pool.query(
			`
			SELECT
				id_membro        AS id_member,
				nome             AS name,
				data_registro    AS register_date,
				data_nascimento  AS birth_date,
				telefone         AS telephone,
				email,
				senha            AS password,
				cargo            AS role,
				id_funcao_fk     AS id_function,
				id_logradouro_fk AS id_logradouro
			FROM membros
			WHERE email = $1
			LIMIT 1
			`,
			[email],
		);

		if (!result.rows[0]) return null;
		return mapRow(result.rows[0]);
	},
};