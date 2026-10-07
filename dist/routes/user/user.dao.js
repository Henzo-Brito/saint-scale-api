import argon2 from "argon2";
import { pool } from "@/db/index.js";
// Converte Date do PostgreSQL para YYYY-MM-DD (ISO, sem timezone shift).
function formatBirthDate(raw) {
    if (!raw)
        return null;
    const d = raw instanceof Date ? raw : new Date(raw);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
function mapRow(row) {
    return {
        id_member: row.id_member,
        name: row.name,
        register_date: row.register_date instanceof Date
            ? row.register_date.toISOString()
            : String(row.register_date),
        birth_date: formatBirthDate(row.birth_date),
        telephone: row.telephone ?? null,
        email: row.email,
        role: row.role,
        id_logradouro: row.id_logradouro ?? null,
    };
}
export const userDao = {
    // ── POST / ───────────────────────────────────────────────────────
    async createUser(user) {
        const hashedPassword = await argon2.hash(user.password, {
            type: argon2.argon2id,
        });
        const result = await pool.query(`INSERT INTO membros (nome, data_nascimento, telefone, email, senha, cargo)
			 VALUES ($1, $2, $3, $4, $5, 'membro')
			 RETURNING
				id_membro        AS id_member,
				nome             AS name,
				data_registro    AS register_date,
				data_nascimento  AS birth_date,
				telefone         AS telephone,
				email,
				cargo            AS role,
				id_logradouro_fk AS id_logradouro`, [user.name, user.birth_date, user.telephone, user.email, hashedPassword]);
        return mapRow(result.rows[0]);
    },
    // ── GET / ────────────────────────────────────────────────────────
    async getUsers() {
        const result = await pool.query(`SELECT
				id_membro        AS id_member,
				nome             AS name,
				data_registro    AS register_date,
				data_nascimento  AS birth_date,
				telefone         AS telephone,
				email,
				cargo            AS role,
				id_logradouro_fk AS id_logradouro
			FROM membros`);
        return result.rows.map(mapRow);
    },
    // ── GET /me ──────────────────────────────────────────────────────
    async getMe(idMember) {
        const memberResult = await pool.query(`SELECT
				m.id_membro       AS id_membro,
				m.nome            AS nome,
				m.email           AS email,
				m.img_id          AS img_id,
				m.cargo           AS cargo,
				m.data_nascimento AS data_nascimento,
				m.telefone        AS telefone,
				m.data_registro   AS data_registro,
				l.rua             AS rua,
				l.numero          AS numero
			FROM membros m
			LEFT JOIN logradouros l ON l.id_logradouro = m.id_logradouro_fk
			WHERE m.id_membro = $1
			LIMIT 1`, [idMember]);
        if (!memberResult.rows[0])
            return null;
        const m = memberResult.rows[0];
        const funcoesResult = await pool.query(`SELECT f.nome
			FROM membros_funcoes mf
			JOIN funcoes f ON f.id_funcao = mf.id_funcoes_fk
			WHERE mf.id_membros_fk = $1`, [idMember]);
        const equipesResult = await pool.query(`SELECT
				e.img_id                       AS img_id,
				e.title                        AS title,
				COUNT(em2.id_membros_fk)::INT  AS quant_part
			FROM equipes_membros em1
			JOIN equipes e ON e.id_equipes = em1.id_equipes_fk
			LEFT JOIN equipes_membros em2 ON em2.id_equipes_fk = e.id_equipes
			WHERE em1.id_membros_fk = $1
			GROUP BY e.id_equipes, e.img_id, e.title`, [idMember]);
        return {
            id_membro: m.id_membro,
            nome: m.nome,
            email: m.email,
            img_id: m.img_id ?? null,
            cargo: m.cargo,
            funcoes: funcoesResult.rows.map((r) => r.nome),
            data_nascimento: formatBirthDate(m.data_nascimento),
            telefone: m.telefone ?? null,
            logradouro: m.rua != null ? { rua: m.rua, numero: m.numero } : null,
            equipes: equipesResult.rows.map((r) => ({
                img_id: r.img_id ?? null,
                title: r.title,
                quant_part: r.quant_part,
            })),
            data_registro: m.data_registro instanceof Date
                ? m.data_registro.toISOString()
                : String(m.data_registro),
        };
    },
    // ── PATCH ────────────────────────────────────────────────────────
    async alterEmail(idMember, data) {
        const result = await pool.query(`UPDATE membros SET email = $1 WHERE id_membro = $2`, [data.email, idMember]);
        return (result.rowCount ?? 0) > 0;
    },
    // Público — identifica pelo email, não pelo JWT.
    async forgotPassword(data) {
        const hashedPassword = await argon2.hash(data.password, {
            type: argon2.argon2id,
        });
        const result = await pool.query(`UPDATE membros SET senha = $1 WHERE email = $2`, [hashedPassword, data.email]);
        return (result.rowCount ?? 0) > 0;
    },
    // Faz upsert do logradouro e atualiza a FK do membro.
    async alterLogradouro(idMember, data) {
        // Reutiliza logradouro existente com mesma rua+numero, ou cria um novo.
        const upsert = await pool.query(`INSERT INTO logradouros (rua, numero)
			 VALUES ($1, $2)
			 ON CONFLICT (rua, numero) DO NOTHING
			 RETURNING id_logradouro`, [data.rua, data.numero]);
        let idLogradouro;
        if (upsert.rows.length > 0) {
            idLogradouro = upsert.rows[0].id_logradouro;
        }
        else {
            // Já existia — busca o id
            const existing = await pool.query(`SELECT id_logradouro FROM logradouros WHERE rua = $1 AND numero = $2 LIMIT 1`, [data.rua, data.numero]);
            if (!existing.rows[0])
                return false;
            idLogradouro = existing.rows[0].id_logradouro;
        }
        const result = await pool.query(`UPDATE membros SET id_logradouro_fk = $1 WHERE id_membro = $2`, [idLogradouro, idMember]);
        return (result.rowCount ?? 0) > 0;
    },
    async alterBirthday(idMember, data) {
        // birth_date já vem em YYYY-MM-DD — PostgreSQL aceita diretamente.
        const result = await pool.query(`UPDATE membros SET data_nascimento = $1 WHERE id_membro = $2`, [data.birth_date, idMember]);
        return (result.rowCount ?? 0) > 0;
    },
    async alterTelephone(idMember, data) {
        const result = await pool.query(`UPDATE membros SET telefone = $1 WHERE id_membro = $2`, [data.telephone, idMember]);
        return (result.rowCount ?? 0) > 0;
    },
};
