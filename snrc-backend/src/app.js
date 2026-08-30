// src/app.js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { corsOptions } from "./config/cors.js";
import { csrfProtection } from "./utils/csrf.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { env } from "./config/env.js";
import routes from "./routes/index.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Important derrière cPanel / Passenger / proxy
app.set("trust proxy", 1);

// Sécurité HTTP
app.use(helmet());

// CORS AVANT les routes
app.use(cors(corsOptions));

// Préflight CORS pour toutes les routes
app.options(/.*/, cors(corsOptions));

// Logs des requêtes HTTP
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// Compression gzip/brotli des réponses
app.use(compression());

// Parsers
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

// Protection CSRF (double-submit cookie) pour toute mutation authentifiée par cookie
app.use(csrfProtection);

// Uploads publics (mis en cache 7 jours côté client/CDN)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    maxAge: "7d",
    immutable: true,
    setHeaders: (res, filePath) => {
      // Nécessaire car le frontend est servi depuis une origine différente
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      // Le dossier documents (CV/lettres de motivation issus du formulaire
      // public de candidature) est le plus sensible : on force le
      // téléchargement plutôt que le rendu/l'exécution dans le navigateur.
      const normalized = filePath.split(path.sep).join("/");
      if (normalized.includes("/uploads/documents/")) {
        res.setHeader("Content-Disposition", "attachment");
      }
    },
  })
);

// Health check simple
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "SNRC API",
    timestamp: new Date().toISOString(),
  });
});

// Routes API
app.use("/api", routes);

// 404 API
app.use(notFound);

// Gestion globale des erreurs
app.use(errorHandler(env));

export default app;