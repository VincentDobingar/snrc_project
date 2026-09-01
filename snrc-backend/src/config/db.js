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

// Exécute `callback(client)` dans une transaction (BEGIN/COMMIT, ROLLBACK en
// cas d'erreur). Nécessaire pour les vérifications "lire puis agir" qui
// doivent rester atomiques face à des requêtes concurrentes (ex. verrouiller
// des lignes via SELECT ... FOR UPDATE avant de les modifier).
export async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
