import { body } from "express-validator";

export const jobOfferValidator = [
  body("title").trim().notEmpty().withMessage("Titre requis"),
  body("description").trim().notEmpty().withMessage("Description requise"),
  body("slug").optional().trim(),
  body("contract_type").optional().trim(),
  body("location").optional().trim(),
  body("application_deadline").optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage("Date limite invalide"),
  body("status").optional().isIn(["draft", "published", "closed"]).withMessage("Statut invalide"),
];
