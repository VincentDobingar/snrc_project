import { body } from "express-validator";

export const contactMessageValidator = [
  body("full_name").trim().notEmpty().withMessage("Nom complet requis"),
  body("email").isEmail().withMessage("Email invalide"),
  body("subject").trim().notEmpty().withMessage("Sujet requis"),
  body("message").trim().notEmpty().withMessage("Message requis"),
];
