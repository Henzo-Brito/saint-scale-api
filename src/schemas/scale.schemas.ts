import { z } from "@hono/zod-openapi";

// ──────────────────────────────────────────────────────────────────
// GET /scale/{id}
// ──────────────────────────────────────────────────────────────────
export const ScaleDetailSchema = z
	.object({
		id_escala: z.string().openapi({ example: "1" }),
		nome: z.string().openapi({ example: "Mavi" }),
		dia: z.string().openapi({ example: "14" }),
		dia_da_semana: z.string().openapi({ example: "sexta-feira" }),
		data: z.string().openapi({ example: "14/11/2026" }),
	})
	.openapi("ScaleDetail");

// ──────────────────────────────────────────────────────────────────
// GET /scale/{id}/musics
// ──────────────────────────────────────────────────────────────────
export const ScaleMusicItemSchema = z
	.object({
		id_music_escalas: z.string().openapi({ example: "1" }),
		nome: z.string().openapi({ example: "Oceans" }),
		banda: z.string().openapi({ example: "Hillsong" }),
		ordem: z.number().int().openapi({ example: 1 }),
		tom: z.string().openapi({ example: "Re" }),
		image_id: z.string().openapi({ example: "img_001" }),
	})
	.openapi("ScaleMusicItem");

export const ScaleMusicsSchema = z
	.array(ScaleMusicItemSchema)
	.openapi("ScaleMusics");

// ──────────────────────────────────────────────────────────────────
// GET /scale/{id}/music/{id_music_escalas}
// GET /music/{id_music_escalas}   ← novo endpoint sem scale_id
// ──────────────────────────────────────────────────────────────────
export const ScaleMusicDetailSchema = z
	.object({
		id_musica: z.string().openapi({ example: "1" }),
		nome: z.string().openapi({ example: "Oceans" }),
		autor: z.string().openapi({ example: "Hillsong" }),
		tom_atual: z.string().openapi({ example: "Mi" }),
		tom_original: z.string().openapi({ example: "Re" }),
		// bpm agora é INTEGER no banco; null quando não cadastrado
		bpm: z.number().int().nullable().openapi({ example: 72 }),
		ordem: z.number().int().openapi({ example: 1 }),
		link_spotify: z
			.string()
			.openapi({ example: "https://open.spotify.com/track/..." }),
		link_youtube: z
			.string()
			.openapi({ example: "https://youtube.com/watch?v=..." }),
		link_cifra: z.string().openapi({ example: "https://cifraclub.com.br/..." }),
		link_letra: z.string().openapi({ example: "https://letras.mus.br/..." }),
		duracao: z.string().openapi({ example: "05:30" }),
		img_id: z.string().openapi({ example: "img_001" }),
	})
	.openapi("ScaleMusicDetail");

// ──────────────────────────────────────────────────────────────────
// GET /scale/{id}/info
// ──────────────────────────────────────────────────────────────────
export const IndisponibilidadeItemSchema = z
	.object({
		image_id: z.string().openapi({ example: "img_001" }),
		name: z.string().openapi({ example: "João Silva" }),
		funcao: z.string().openapi({ example: "guitarrista" }),
	})
	.openapi("IndisponibilidadeItem");

export const ScaleInfoSchema = z
	.object({
		id_escala: z.string().openapi({ example: "1" }),
		membros_confirmados: z.number().int().openapi({ example: 5 }),
		// local vem diretamente da coluna escalas.local (VARCHAR(255))
		local: z.string().nullable().openapi({ example: "Rua das Flores, 100" }),
		indisponibilidades: z.array(IndisponibilidadeItemSchema),
	})
	.openapi("ScaleInfo");

// ──────────────────────────────────────────────────────────────────
// GET /scale/{id}/members
// ──────────────────────────────────────────────────────────────────
export const ScaleMemberItemSchema = z
	.object({
		id_membro_escala: z.string().openapi({ example: "1" }),
		nome: z.string().openapi({ example: "João Silva" }),
		funcao: z.string().openapi({ example: "guitarrista" }),
		disponibilidade: z.string().openapi({ example: "confirmado" }),
		image_id: z.string().openapi({ example: "img_001" }),
	})
	.openapi("ScaleMemberItem");

export const ScaleMembersSchema = z
	.array(ScaleMemberItemSchema)
	.openapi("ScaleMembers");

// ──────────────────────────────────────────────────────────────────
// POST /scale/sair
// ──────────────────────────────────────────────────────────────────
export const SairBodySchema = z
	.object({
		id_escala: z.string().openapi({ example: "1" }),
	})
	.openapi("SairBody");

// Resposta genérica para operações de escala que não retornam dados
export const PatchResponseSchema = z
	.object({
		message: z.string(),
	})
	.openapi("PatchResponse");

// ──────────────────────────────────────────────────────────────────
// POST /scale/substituir
// ──────────────────────────────────────────────────────────────────
export const SubstituirBodySchema = z
	.object({
		id_membro_escala: z.string().openapi({ example: "3" }),
	})
	.openapi("SubstituirBody");

// ──────────────────────────────────────────────────────────────────
// Params
// ──────────────────────────────────────────────────────────────────
export const ScaleIdParamSchema = z.object({
	id: z.string().openapi({ example: "1" }),
});

export const ScaleMusicParamSchema = z.object({
	id: z.string().openapi({ example: "1" }),
	id_music_escalas: z.string().openapi({ example: "2" }),
});

// Parâmetro para o novo endpoint /music/{id_music_escalas}
export const MusicEscalasParamSchema = z.object({
	id_music_escalas: z.string().openapi({ example: "2" }),
});
