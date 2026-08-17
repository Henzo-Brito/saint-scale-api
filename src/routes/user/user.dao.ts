import { z } from "@hono/zod-openapi"
import crypto from "node:crypto";

export const UserSchema = z.object({
    id_member: z.string().uuid(),
    name: z.string().max(150),
    register_date: z.string().datetime(),
    birth_date: z.string().date(),
    telephone: z.string().max(11),
    email: z.string().max(100),
    password: z.string().max(100),
    role: z.enum(["organizador", "líder", "membro"]),
    id_function: z.string().uuid(),
    id_logradouro: z.string().uuid(),
}).openapi("User");

export const CreateUserSchema = z.object({
    name: z.string().max(150),
    birth_date: z.string().date(),
    telephone: z.string().max(11),
    email: z.string().max(100),
    password: z.string().max(100),
    role: z.enum(["organizador", "líder", "membro"]),
    id_function: z.string().uuid(),
    id_logradouro: z.string().uuid(),
}).openapi("CreateUser"); 

export type User = z.infer<typeof UserSchema>
export type CreateUser = z.infer<typeof CreateUserSchema>

export let users: User[] = [
    {  
        id_member: "123e4567-e89b-12d3-a456-426614174000",
        name: "Henzo Brito dos Santos",
        register_date: "2026-08-17T15:16:28.439Z",
        birth_date: "2026-11-14",
        telephone: "11987051565",
        email: "henzoca.2020@gmail.com",
        password: "Henzo.2008",
        role: "organizador",
        id_function: "123e4567-e89b-12d3-a456-426614174000",
        id_logradouro: "123e4567-e89b-12d3-a456-426614174000"
    }
];
export type Users = typeof users;

export function createUserDao(user: CreateUser): User{
    const newUser:User = {
        id_member: crypto.randomUUID(),
        name: user.name,
        register_date: new Date().toISOString(),
        birth_date: user.birth_date,
        telephone: user.telephone,
        email: user.email,
        password: user.password,
        role: user.role,
        id_function: user.id_function,
        id_logradouro: user.id_logradouro
    }
    users.push(newUser)
    console.log(newUser, users);

    return newUser
}

export function getUserDao(): User[]{
    return users
}
/*
{
  "name": "Henzo Brito dos Santos",
  "birth_date": "2026-11-14",
  "telephone": "11987051565",
  "email": "henzoca.2020@gmail.com",
  "password": "Henzo.2008",
  "role": "organizador",
  "id_function": "123e4567-e89b-12d3-a456-426614174000",
  "id_logradouro": "123e4567-e89b-12d3-a456-426614174000"
}*/