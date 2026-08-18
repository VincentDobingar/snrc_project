import { body } from "express-validator";

export const newsValidator = [
  body("title").trim().notEmpty().withMessage("Titre requis"),
  body("content").trim().notEmpty().withMessage("Contenu requis"),
  body("slug").optional().trim(),
  body("status").optional().isIn(["draft", "published"]).withMessage("Statut invalide"),
];
