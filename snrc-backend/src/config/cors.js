// src/config/cors.js

const defaultAllowedOrigins = [
  "https://snrc.td",
  "https://www.snrc.td",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const envAllowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins =
  envAllowedOrigins.length > 0 ? envAllowedOrigins : defaultAllowedOrigins;

export const corsOptions = {
  origin(origin, callback) {
    // Autorise les requêtes sans Origin : curl, health checks, serveur interne
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn("❌ Origin CORS refusée :", origin);
    console.warn("✅ Origins autorisées :", allowedOrigins);

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