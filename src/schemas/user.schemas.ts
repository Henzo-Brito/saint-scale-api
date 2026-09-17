// Schemas de validação para o modelo de usuário no backend.
//
// Esses schemas fazem duas coisas:
//   1. Validam os dados de entrada e saída da API (via zod)
//   2. Geram automaticamente a documentação OpenAPI (via .openapi())
//
// O @hono/zod-openapi usa esses schemas para criar os tipos TypeScript
// E a documentação ao mesmo tempo — uma fonte de verdade só.

import { z } from "@hono/zod-openapi";

// Validação customizada para o formato de data MM-DD-YYYY,
// que é o formato que o frontend envia (após converter de DD/MM/YYYY).
const birthDateSchema = z
    .string()
    .regex(
        /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-\d{4}$/,
        "Birth date must be in MM-DD-YYYY format",
    );

// Representa um usuário completo na resposta da API.
// O campo id_member aqui é um INTEGER (não UUID como o frontend espera).
// Isso cria uma incompatibilidade com o UserSchema do frontend.
export const UserSchema = z
    .object({
        id_member: z.number().int(),
        name: z.string().max(150).nullable(),
        register_date: z.string().datetime(),
        birth_date: birthDateSchema,
        telephone: z.string().max(11),
        email: z.string().email().max(255),
        password: z.string().min(8).max(255),
        // O role aqui aceita qualquer string — sem enum fixo.
        // Mas o frontend espera apenas ["organizador", "líder", "membro"].
        role: z.string().max(60),
        id_function: z.number().int().nullable(),
        id_logradouro: z.number().int().nullable(),
    })
    .openapi("User");

// Schema para validar os dados de criação de um novo usuário.
// O campo "role" é enviado pelo frontend mas o createUser do DAO
// ignora o valor enviado e usa "membro" fixo.
export const CreateUserSchema = z
    .object({
        name: z.string().max(150),
        birth_date: birthDateSchema,
        telephone: z.string().max(11),
        email: z.string().email().max(255),
        password: z.string().min(8).max(60),
        role: z.string().max(60),
    })
    .openapi("CreateUser");

export type User = z.infer<typeof UserSchema>;

export type CreateUser = z.infer<typeof CreateUserSchema>;
