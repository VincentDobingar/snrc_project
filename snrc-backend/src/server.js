// src/server.js
import app from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./config/db.js";

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(`✅ SNRC API running on port ${PORT}`);
});

// Filet de sécurité process-level : sans ces handlers, une erreur non
// interceptée (promesse rejetée sans .catch, exception synchrone hors
// middleware Express) fait planter tout le process Node sans log exploitable.
process.on("unhandledRejection", (reason) => {
  console.error("🔥 unhandledRejection :", reason);
});

process.on("uncaughtException", (error) => {
  console.error("🔥 uncaughtException :", error);
});

async function shutdown(signal) {
  console.log(`\n${signal} reçu, arrêt propre du serveur...`);
  server.close(async () => {
    try {
      await pool.end();
      console.log("✅ Pool PostgreSQL fermé, serveur arrêté proprement.");
      process.exit(0);
    } catch (err) {
      console.error("Erreur lors de la fermeture du pool PostgreSQL :", err);
      process.exit(1);
    }
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));