import { body } from "express-validator";

export const publicationValidator = [
  body("title").trim().notEmpty().withMessage("Titre requis"),
  body("slug").optional().trim(),
  body("file_url").optional().trim(),
  body("status").optional().isIn(["draft", "published"]).withMessage("Statut invalide"),
];
