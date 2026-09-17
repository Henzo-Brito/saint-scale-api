// Script de migração do banco de dados.
//
// "Migração" é o processo de criar ou atualizar as tabelas do banco
// a partir de um arquivo SQL. Esse script lê o arquivo tcc.sql e
// executa todas as instruções nele.
//
// Como usar:
//   npx tsx src/db/migrate.ts
//
// ATENÇÃO: O tcc.sql começa com DROP TABLE CASCADE em todas as tabelas,
// o que significa que rodar esse script vai apagar todos os dados existentes
// e recriar as tabelas do zero. Use com cuidado em ambientes com dados reais.

import { readFile } from "node:fs/promises";
import { pool } from "./index.js";

// Lê o arquivo SQL que está na mesma pasta desse arquivo.
// O "import.meta.url" é uma forma de referenciar o diretório do arquivo
// atual em módulos ES (ESM), equivalente ao __dirname do CommonJS.
const sql = await readFile(
    new URL("./tcc.sql", import.meta.url),
    "utf8",
);

// Executa todo o conteúdo do SQL de uma vez.
// O tcc.sql usa transações (BEGIN/COMMIT), então se qualquer parte falhar,
// nada é aplicado.
await pool.query(sql);

console.log("Migrations executadas com sucesso.");

// Encerra o pool de conexões para que o processo Node finalize corretamente.
await pool.end();
