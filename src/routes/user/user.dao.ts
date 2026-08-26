import crypto from "node:crypto";
import type { User, CreateUser } from "@/schemas/user.schemas.js";

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

export function createUserDao(user: CreateUser): User{
    const newUser:User = {
        id_member: crypto.randomUUID(),
        name: user.name,
        register_date: new Date().toISOString(),
        birth_date: user.birth_date,
        telephone: user.telephone,
        email: user.email,
        password: user.password,
        role: "membro",
        id_function: null,
        id_logradouro: null
    }
    users.push(newUser)
    console.log(newUser, users);

    return newUser
}

export function getUserDao(): User[]{
    return users
}