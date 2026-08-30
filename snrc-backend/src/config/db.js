import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

export const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
});

pool.on("error", (err) => {
  console.error("Erreur inattendue du pool PostgreSQL :", err);
});

export async function query(text, params = []) {
  return pool.query(text, params);
}
