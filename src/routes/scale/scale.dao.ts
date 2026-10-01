import { pool } from "@/db/index.js";

const DAYS_OF_WEEK = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
];

function formatDate(d: Date): string {
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export const scaleDao = {

    // ----------------------------------------------------------------
    // GET /scale/{id}
    // ----------------------------------------------------------------
    async getScale(id: string) {
        const result = await pool.query(
            `SELECT
                id_escala::TEXT AS id_escala,
                nome_escala     AS nome,
                data_hora
            FROM escalas
            WHERE id_escala = $1`,
            [id],
        );

        if (result.rows.length === 0) return null;

        const r = result.rows[0];
        const d = new Date(r.data_hora);

        return {
            id_escala:     r.id_escala,
            nome:          r.nome,
            dia:           String(d.getDate()).padStart(2, "0"),
            dia_da_semana: DAYS_OF_WEEK[d.getDay()],
            data:          formatDate(d),
        };
    },

    // ----------------------------------------------------------------
    // GET /scale/{id}/musics
    // ----------------------------------------------------------------
    async getScaleMusics(id: string) {
        const result = await pool.query(
            `SELECT
                me.id_musica_escala::TEXT        AS id_music_escalas,
                m.nome                           AS nome,
                m.autor                          AS banda,
                COALESCE(me.ordem, '0')::INT     AS ordem,
                COALESCE(me.tom, m.tom, '')      AS tom,
                COALESCE(m.img_id, '')           AS image_id
            FROM musicas_escalas me
            JOIN musicas m ON m.id_musica = me.id_musica_fk
            WHERE me.id_escala_fk = $1
            ORDER BY me.ordem::INT`,
            [id],
        );

        return result.rows.map((r) => ({
            id_music_escalas: r.id_music_escalas,
            nome:             r.nome,
            banda:            r.banda,
            ordem:            r.ordem,
            tom:              r.tom,
            image_id:         r.image_id,
        }));
    },

    // ----------------------------------------------------------------
    // GET /scale/{id}/music/{id_music_escalas}
    // ----------------------------------------------------------------
    async getScaleMusicDetail(id: string, idMusicEscalas: string) {
        const result = await pool.query(
            `SELECT
                m.id_musica::TEXT               AS id_musica,
                m.nome                          AS nome,
                m.autor                         AS autor,
                COALESCE(me.tom, '')            AS tom_atual,
                COALESCE(m.tom, '')             AS tom_original,
                COALESCE(m.bpm, '')             AS bpm,
                COALESCE(me.ordem, '0')::INT    AS ordem,
                COALESCE(m.link_spotify, '')    AS link_spotify,
                COALESCE(m.link_youtube, '')    AS link_youtube,
                COALESCE(m.link_cifra, '')      AS link_cifra,
                COALESCE(m.link_letra, '')      AS link_letra,
                m.duracao                       AS duracao,
                COALESCE(m.img_id, '')          AS img_id
            FROM musicas_escalas me
            JOIN musicas m ON m.id_musica = me.id_musica_fk
            WHERE me.id_escala_fk = $1
              AND me.id_musica_escala = $2`,
            [id, idMusicEscalas],
        );

        if (result.rows.length === 0) return null;

        const r = result.rows[0];
        return {
            id_musica:    r.id_musica,
            nome:         r.nome,
            autor:        r.autor,
            tom_atual:    r.tom_atual,
            tom_original: r.tom_original,
            bpm:          r.bpm,
            ordem:        r.ordem,
            link_spotify: r.link_spotify,
            link_youtube: r.link_youtube,
            link_cifra:   r.link_cifra,
            link_letra:   r.link_letra,
            duracao:      r.duracao,
            img_id:       r.img_id,
        };
    },

    // ----------------------------------------------------------------
    // GET /scale/{id}/info
    // ----------------------------------------------------------------
    async getScaleInfo(id: string) {
        const scaleResult = await pool.query(
            `SELECT
                e.id_escala::TEXT AS id_escala,
                COUNT(CASE WHEN me.disponibilidade = 'confirmado' THEN 1 END)::INT AS membros_confirmados,
                COALESCE(l.rua || ', ' || l.numero::TEXT, '') AS local
            FROM escalas e
            LEFT JOIN membros_escalas me ON me.id_escala_fk = e.id_escala
            LEFT JOIN membros m ON m.id_membro = me.id_membro_fk
            LEFT JOIN logradouros l ON l.id_logradouro = m.id_logradouro_fk
            WHERE e.id_escala = $1
            GROUP BY e.id_escala, l.rua, l.numero`,
            [id],
        );

        if (scaleResult.rows.length === 0) return null;

        const indisp = await pool.query(
            `SELECT
                COALESCE(m.img_id, '') AS image_id,
                m.nome                 AS name,
                COALESCE(f.nome, '')   AS funcao
            FROM membros_escalas me
            JOIN membros m ON m.id_membro = me.id_membro_fk
            LEFT JOIN funcoes f ON f.id_funcao = me.id_funcao_fk
            WHERE me.id_escala_fk = $1
              AND me.disponibilidade = 'indisponível'`,
            [id],
        );

        const row = scaleResult.rows[0];
        return {
            id_escala:           row.id_escala,
            membros_confirmados: row.membros_confirmados,
            local:               row.local,
            indisponibilidades:  indisp.rows.map((i) => ({
                image_id: i.image_id,
                name:     i.name,
                funcao:   i.funcao,
            })),
        };
    },

    // ----------------------------------------------------------------
    // GET /scale/{id}/members
    // ----------------------------------------------------------------
    async getScaleMembers(id: string) {
        const result = await pool.query(
            `SELECT
                me.id_membro_escala::TEXT  AS id_membro_escala,
                m.nome                     AS nome,
                COALESCE(f.nome, '')       AS funcao,
                me.disponibilidade::TEXT   AS disponibilidade,
                COALESCE(m.img_id, '')     AS image_id
            FROM membros_escalas me
            JOIN membros m ON m.id_membro = me.id_membro_fk
            LEFT JOIN funcoes f ON f.id_funcao = me.id_funcao_fk
            WHERE me.id_escala_fk = $1
            ORDER BY m.nome`,
            [id],
        );

        return result.rows.map((r) => ({
            id_membro_escala: r.id_membro_escala,
            nome:             r.nome,
            funcao:           r.funcao,
            disponibilidade:  r.disponibilidade,
            image_id:         r.image_id,
        }));
    },

    // ----------------------------------------------------------------
    // POST /scale/sair
    // Marca o usuário (via JWT) como indisponível na escala
    // e retorna as músicas da escala
    // ----------------------------------------------------------------
    async sair(idEscala: string, idMembro: string) {
        await pool.query(
            `UPDATE membros_escalas
             SET disponibilidade = 'indisponível'
             WHERE id_escala_fk = $1
               AND id_membro_fk = $2`,
            [idEscala, idMembro],
        );

        return scaleDao.getScaleMusics(idEscala);
    },

    // ----------------------------------------------------------------
    // POST /scale/substituir
    // Troca o id_membro_fk do registro para o usuário atual (JWT)
    // e retorna os membros atualizados da escala
    // ----------------------------------------------------------------
    async substituir(idMembroEscala: string, idMembroAtual: string) {
        // Busca a escala relacionada para retornar os membros depois
        const lookup = await pool.query(
            `SELECT id_escala_fk FROM membros_escalas WHERE id_membro_escala = $1`,
            [idMembroEscala],
        );

        if (lookup.rows.length === 0) return null;

        const idEscala = lookup.rows[0].id_escala_fk;

        await pool.query(
            `UPDATE membros_escalas
             SET id_membro_fk = $1,
                 disponibilidade = 'confirmado'
             WHERE id_membro_escala = $2`,
            [idMembroAtual, idMembroEscala],
        );

        return scaleDao.getScaleMembers(String(idEscala));
    },
};
