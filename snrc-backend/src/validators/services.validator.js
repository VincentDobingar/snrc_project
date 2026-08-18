import { body } from "express-validator";

export const serviceValidator = [
  body("title").trim().notEmpty().withMessage("Titre requis"),
  body("slug").optional().trim(),
  body("display_order").optional().isInt({ min: 0 }).withMessage("Ordre invalide"),
  body("status").optional().isIn(["draft", "published"]).withMessage("Statut invalide"),
];
