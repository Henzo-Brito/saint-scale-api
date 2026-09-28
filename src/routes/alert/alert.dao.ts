import { pool } from "@/db/index.js";

function formatDate(d: Date): string {
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export const alertDao = {

    // ----------------------------------------------------------------
    // GET /alert/reminder
    // Retorna alertas (lembretes) + notificações
    // ----------------------------------------------------------------
    async getReminder() {
        const [alertResult, notifResult] = await Promise.all([
            pool.query(
                `SELECT
                    l.id_lembrete::TEXT AS id_escala,
                    l.nome              AS name,
                    l.data              AS date,
                    ARRAY_AGG(f.nome)   AS functions
                FROM lembretes l
                LEFT JOIN lembrete_funcoes lf ON lf.id_lembrete_fk = l.id_lembrete
                LEFT JOIN funcoes f ON f.id_funcao = lf.id_funcao_fk
                GROUP BY l.id_lembrete, l.nome, l.data
                ORDER BY l.data`,
            ),
            pool.query(
                `SELECT
                    id_notificacao::TEXT AS id_notification,
                    titulo               AS title,
                    data                 AS date
                FROM notificacoes
                ORDER BY data`,
            ),
        ]);

        return {
            alert: alertResult.rows.map((r) => ({
                id_escala: r.id_escala,
                name:      r.name,
                date:      formatDate(new Date(r.date)),
                functions: r.functions.filter(Boolean),
            })),
            notifications: notifResult.rows.map((r) => ({
                id_notification: r.id_notification,
                title:           r.title,
                date:            formatDate(new Date(r.date)),
            })),
        };
    },

    // ----------------------------------------------------------------
    // GET /alert/reminder/{id_reminder}
    // Retorna detalhe de um lembrete
    // ----------------------------------------------------------------
    async getReminderDetail(idReminder: number) {
        const [lemResult, funcResult] = await Promise.all([
            pool.query(
                `SELECT
                    id_lembrete::TEXT AS id_escala,
                    nome              AS name,
                    data              AS date,
                    tempo             AS tempo,
                    descricao         AS description
                FROM lembretes
                WHERE id_lembrete = $1`,
                [idReminder],
            ),
            pool.query(
                `SELECT f.nome
                FROM lembrete_funcoes lf
                JOIN funcoes f ON f.id_funcao = lf.id_funcao_fk
                WHERE lf.id_lembrete_fk = $1`,
                [idReminder],
            ),
        ]);

        if (lemResult.rows.length === 0) return null;

        const l = lemResult.rows[0];
        return {
            id_escala:   l.id_escala,
            name:        l.name,
            date:        formatDate(new Date(l.date)),
            tempo:       String(l.tempo).slice(0, 5),
            description: l.description ?? "",
            functions:   funcResult.rows.map((r) => r.nome),
        };
    },
};
