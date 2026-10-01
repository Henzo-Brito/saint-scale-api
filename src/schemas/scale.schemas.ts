import { z } from "@hono/zod-openapi";

// ------------------------------------------------------------------
// GET /scale/{id}  — detalhes de uma escala
// ------------------------------------------------------------------
export const ScaleDetailSchema = z
    .object({
        id_escala:     z.string().openapi({ example: "1" }),
        nome:          z.string().openapi({ example: "Mavi" }),
        dia:           z.string().openapi({ example: "14" }),
        dia_da_semana: z.string().openapi({ example: "sexta-feira" }),
        data:          z.string().openapi({ example: "14/11/2026" }),
    })
    .openapi("ScaleDetail");

// ------------------------------------------------------------------
// GET /scale/{id}/musics  — músicas de uma escala
// ------------------------------------------------------------------
export const ScaleMusicItemSchema = z
    .object({
        id_music_escalas: z.string().openapi({ example: "1" }),
        nome:             z.string().openapi({ example: "Oceans" }),
        banda:            z.string().openapi({ example: "Hillsong" }),
        ordem:            z.number().int().openapi({ example: 1 }),
        tom:              z.string().openapi({ example: "Re" }),
        image_id:         z.string().openapi({ example: "img_001" }),
    })
    .openapi("ScaleMusicItem");

export const ScaleMusicsSchema = z.array(ScaleMusicItemSchema).openapi("ScaleMusics");

// ------------------------------------------------------------------
// GET /scale/{id}/music/{id_music_escalas}  — detalhe de uma música
// ------------------------------------------------------------------
export const ScaleMusicDetailSchema = z
    .object({
        id_musica:     z.string().openapi({ example: "1" }),
        nome:          z.string().openapi({ example: "Oceans" }),
        autor:         z.string().openapi({ example: "Hillsong" }),
        tom_atual:     z.string().openapi({ example: "Mi" }),
        tom_original:  z.string().openapi({ example: "Re" }),
        bpm:           z.string().openapi({ example: "72" }),
        ordem:         z.number().int().openapi({ example: 1 }),
        link_spotify:  z.string().openapi({ example: "https://open.spotify.com/track/..." }),
        link_youtube:  z.string().openapi({ example: "https://youtube.com/watch?v=..." }),
        link_cifra:    z.string().openapi({ example: "https://cifraclub.com.br/..." }),
        link_letra:    z.string().openapi({ example: "https://letras.mus.br/..." }),
        duracao:       z.string().openapi({ example: "05:30" }),
        img_id:        z.string().openapi({ example: "img_001" }),
    })
    .openapi("ScaleMusicDetail");

// ------------------------------------------------------------------
// GET /scale/{id}/info  — info de uma escala
// ------------------------------------------------------------------
export const IndisponibilidadeItemSchema = z
    .object({
        image_id: z.string().openapi({ example: "img_001" }),
        name:     z.string().openapi({ example: "João Silva" }),
        funcao:   z.string().openapi({ example: "guitarrista" }),
    })
    .openapi("IndisponibilidadeItem");

export const ScaleInfoSchema = z
    .object({
        id_escala:           z.string().openapi({ example: "1" }),
        membros_confirmados: z.number().int().openapi({ example: 5 }),
        local:               z.string().openapi({ example: "Rua das Flores, 100" }),
        indisponibilidades:  z.array(IndisponibilidadeItemSchema),
    })
    .openapi("ScaleInfo");

// ------------------------------------------------------------------
// GET /scale/{id}/members  — membros de uma escala
// ------------------------------------------------------------------
export const ScaleMemberItemSchema = z
    .object({
        id_membro_escala: z.string().openapi({ example: "1" }),
        nome:             z.string().openapi({ example: "João Silva" }),
        funcao:           z.string().openapi({ example: "guitarrista" }),
        disponibilidade:  z.string().openapi({ example: "confirmado" }),
        image_id:         z.string().openapi({ example: "img_001" }),
    })
    .openapi("ScaleMemberItem");

export const ScaleMembersSchema = z.array(ScaleMemberItemSchema).openapi("ScaleMembers");

// ------------------------------------------------------------------
// POST /scale/sair  — sair de uma escala
// ------------------------------------------------------------------
export const SairBodySchema = z
    .object({
        id_escala: z.string().openapi({ example: "1" }),
    })
    .openapi("SairBody");

// ------------------------------------------------------------------
// POST /scale/substituir  — substituir membro na escala
// ------------------------------------------------------------------
export const SubstituirBodySchema = z
    .object({
        id_membro_escala: z.string().openapi({ example: "3" }),
    })
    .openapi("SubstituirBody");

// ------------------------------------------------------------------
// Params
// ------------------------------------------------------------------
export const ScaleIdParamSchema = z.object({
    id: z.string().openapi({ example: "1" }),
});

export const ScaleMusicParamSchema = z.object({
    id:               z.string().openapi({ example: "1" }),
    id_music_escalas: z.string().openapi({ example: "2" }),
});
