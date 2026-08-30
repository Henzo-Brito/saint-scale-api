import argon2 from "argon2";
import type { User, CreateUser } from "@/schemas/user.schemas.js";
import { pool } from "@/db/index.js";

export const userDao = {
	async createUser(user: CreateUser): Promise<User> {
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
				id_membro AS id_member,
				nome AS name,
				data_registro AS register_date,
				data_nascimento AS birth_date,
				telefone AS telephone,
				email,
				senha AS password,
				cargo AS role,
				id_funcao_fk AS id_function,
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

		return result.rows[0] as User;
	},

	async getUsers(): Promise<User[]> {
		const result = await pool.query(`
			SELECT
				id_membro AS id_member,
				nome AS name,
				data_registro AS register_date,
				data_nascimento AS birth_date,
				telefone AS telephone,
				email,
				senha AS password,
				cargo AS role,
				id_funcao_fk AS id_function,
				id_logradouro_fk AS id_logradouro
			FROM membros
		`);

		return result.rows as User[];
	},

	async getUserByEmail(email: string): Promise<User | null> {
		const result = await pool.query(
			`
			SELECT
				id_membro AS id_member,
				nome AS name,
				data_registro AS register_date,
				data_nascimento AS birth_date,
				telefone AS telephone,
				email,
				senha AS password,
				cargo AS role,
				id_funcao_fk AS id_function,
				id_logradouro_fk AS id_logradouro
			FROM membros
			WHERE email = $1
			LIMIT 1
			`,
			[email],
		);

		return result.rows[0] ?? null;
	},
};