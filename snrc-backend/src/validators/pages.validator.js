import { body } from "express-validator";

export const pageValidator = [
  body("title").trim().notEmpty().withMessage("Titre requis"),
  body("slug").optional().trim(),
  body("status").optional().isIn(["draft", "published"]).withMessage("Statut invalide"),
];
