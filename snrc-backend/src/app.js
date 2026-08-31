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
import { requireAuth } from "./middlewares/requireAuth.js";
import { requireRole } from "./middlewares/requireRole.js";
import { PublicationsModel } from "./models/publications.model.js";

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

// Uploads publics : images et vidéos (contenu éditorial destiné au grand
// public — bannières de sections, actualités, vidéos du discours, etc.),
// mis en cache 7 jours côté client/CDN.
const publicUploadHeaders = (res) => {
  // Nécessaire car le frontend est servi depuis une origine différente
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
};
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "../uploads/images"), {
    maxAge: "7d",
    immutable: true,
    setHeaders: publicUploadHeaders,
  })
);
app.use(
  "/uploads/videos",
  express.static(path.join(__dirname, "../uploads/videos"), {
    maxAge: "7d",
    immutable: true,
    setHeaders: publicUploadHeaders,
  })
);

// Uploads du dossier "documents" : deux usages bien distincts y partagent le
// même dossier physique — les CV/lettres de motivation (formulaire public de
// candidature, doivent rester privés) et les fichiers de Publications
// (rapports/communiqués, doivent rester publics). On les distingue par une
// vérification en base plutôt que par un sous-dossier, pour ne pas casser
// l'accès aux publications déjà en ligne : si le fichier demandé correspond à
// une publication publiée, il est servi publiquement ; sinon, authentification
// admin requise et téléchargement forcé (pas de rendu/exécution navigateur).
app.get("/uploads/documents/:filename", async (req, res, next) => {
  const filename = path.basename(req.params.filename); // anti path traversal
  const filePath = path.join(__dirname, "../uploads/documents", filename);

  let isPublishedPublication = false;
  try {
    isPublishedPublication = await PublicationsModel.existsByFileUrl(`/uploads/documents/${filename}`);
  } catch (err) {
    return next(err);
  }

  if (isPublishedPublication) {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    return res.sendFile(filePath, (err) => {
      if (err) next(err);
    });
  }

  return requireAuth(req, res, (authErr) => {
    if (authErr) return next(authErr);
    return requireRole("superadmin", "admin_editeur")(req, res, (roleErr) => {
      if (roleErr) return next(roleErr);
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Content-Disposition", "attachment");
      res.sendFile(filePath, (err) => {
        if (err) next(err);
      });
    });
  });
});

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