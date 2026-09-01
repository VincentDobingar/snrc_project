// src/config/cors.js
import { env } from "./env.js";

export const corsOptions = {
  origin(origin, callback) {
    // Autorise les requêtes sans Origin : curl, health checks, serveur interne
    if (!origin) {
      return callback(null, true);
    }

    if (env.ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    console.warn("❌ Origin CORS refusée :", origin);
    console.warn("✅ Origins autorisées :", env.ALLOWED_ORIGINS);

    return callback(new Error(`Origin CORS non autorisée : ${origin}`));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-CSRF-Token",
    "Accept",
    "Origin",
  ],

  exposedHeaders: ["Set-Cookie"],

  optionsSuccessStatus: 204,
};
