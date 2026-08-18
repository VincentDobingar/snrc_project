import { body } from "express-validator";

export const faqValidator = [
  body("question").trim().notEmpty().withMessage("Question requise"),
  body("answer").trim().notEmpty().withMessage("Réponse requise"),
  body("display_order").optional().isInt({ min: 0 }).withMessage("Ordre invalide"),
  body("status").optional().isIn(["active", "inactive"]).withMessage("Statut invalide"),
];
