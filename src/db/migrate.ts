import { readFile } from "node:fs/promises";
import { pool } from "./index.js";

const sql = await readFile(
	new URL("./tcc.sql", import.meta.url),
	"utf8",
);

await pool.query(sql);

console.log("Migrations executadas com sucesso.");

await pool.end();