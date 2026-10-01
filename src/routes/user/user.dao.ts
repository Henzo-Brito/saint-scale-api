import argon2 from "argon2";
import type {
	User,
	CreateUser,
	Me,
	AlterEmail,
	ForgotPassword,
	AlterLogradouro,
	AlterBirthday,
	AlterTelephone,
} from "@/schemas/user.schemas.js";
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
	// ── GET ─────────────────────────────────────────────────────────

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
				id_logradouro_fk
			)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING
				id_membro        AS id_member,
				nome             AS name,
				data_registro    AS register_date,
				data_nascimento  AS birth_date,
				telefone         AS telephone,
				email,
				senha            AS password,
				cargo            AS role,
				NULL::INTEGER    AS id_function,
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
				NULL::INTEGER    AS id_function,
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
				NULL::INTEGER    AS id_function,
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

	// ── GET /me ──────────────────────────────────────────────────────

	async getMe(idMember: number): Promise<Me | null> {
		// 1. Dados do membro + logradouro
		const memberResult = await pool.query(
			`SELECT
				m.id_membro        AS id_membro,
				m.nome             AS nome,
				m.email            AS email,
				m.img_id           AS img_id,
				m.cargo            AS cargo,
				m.data_nascimento  AS data_nascimento,
				m.telefone         AS telefone,
				m.data_registro    AS data_registro,
				l.rua              AS rua,
				l.numero           AS numero
			FROM membros m
			LEFT JOIN logradouros l ON l.id_logradouro = m.id_logradouro_fk
			WHERE m.id_membro = $1
			LIMIT 1`,
			[idMember],
		);

		if (!memberResult.rows[0]) return null;
		const m = memberResult.rows[0];

		// 2. Funções do membro
		const funcoesResult = await pool.query(
			`SELECT f.nome
			FROM membros_funcoes mf
			JOIN funcoes f ON f.id_funcao = mf.id_funcoes_fk
			WHERE mf.id_membros_fk = $1`,
			[idMember],
		);

		// 3. Equipes + quantidade de participantes por equipe
		const equipesResult = await pool.query(
			`SELECT
				e.img_id                              AS img_id,
				e.title                               AS title,
				COUNT(em2.id_membros_fk)::INT         AS quant_part
			FROM equipes_membros em1
			JOIN equipes e ON e.id_equipes = em1.id_equipes_fk
			LEFT JOIN equipes_membros em2 ON em2.id_equipes_fk = e.id_equipes
			WHERE em1.id_membros_fk = $1
			GROUP BY e.id_equipes, e.img_id, e.title`,
			[idMember],
		);

		return {
			id_membro:       m.id_membro,
			nome:            m.nome,
			email:           m.email,
			img_id:          m.img_id ?? null,
			cargo:           m.cargo,
			funcoes:         funcoesResult.rows.map((r) => r.nome),
			data_nascimento: formatBirthDate(m.data_nascimento),
			telefone:        m.telefone ?? null,
			logradouro:      m.rua != null ? { rua: m.rua, numero: m.numero } : null,
			equipes:         equipesResult.rows.map((r) => ({
				img_id:     r.img_id ?? null,
				title:      r.title,
				quant_part: r.quant_part,
			})),
			data_registro: m.data_registro instanceof Date
				? m.data_registro.toISOString()
				: String(m.data_registro),
		};
	},

	// ── PATCH ────────────────────────────────────────────────────────

	async alterEmail(data: AlterEmail): Promise<boolean> {
		const result = await pool.query(
			`UPDATE membros SET email = $1 WHERE id_membro = $2`,
			[data.email, data.id_member],
		);
		return (result.rowCount ?? 0) > 0;
	},

	async forgotPassword(data: ForgotPassword): Promise<boolean> {
		const hashedPassword = await argon2.hash(data.password, {
			type: argon2.argon2id,
		});
		const result = await pool.query(
			`UPDATE membros SET senha = $1 WHERE id_membro = $2`,
			[hashedPassword, data.id_member],
		);
		return (result.rowCount ?? 0) > 0;
	},

	async alterLogradouro(data: AlterLogradouro): Promise<boolean> {
		const result = await pool.query(
			`UPDATE membros SET id_logradouro_fk = $1 WHERE id_membro = $2`,
			[data.id_logradouro, data.id_member],
		);
		return (result.rowCount ?? 0) > 0;
	},

	async alterBirthday(data: AlterBirthday): Promise<boolean> {
		// Input is MM-DD-YYYY; convert to ISO YYYY-MM-DD for PostgreSQL
		const [month, day, year] = data.birth_date.split("-");
		const birthDate = `${year}-${month}-${day}`;
		const result = await pool.query(
			`UPDATE membros SET data_nascimento = $1 WHERE id_membro = $2`,
			[birthDate, data.id_member],
		);
		return (result.rowCount ?? 0) > 0;
	},

	async alterTelephone(data: AlterTelephone): Promise<boolean> {
		const result = await pool.query(
			`UPDATE membros SET telefone = $1 WHERE id_membro = $2`,
			[data.telephone, data.id_member],
		);
		return (result.rowCount ?? 0) > 0;
	},
};
