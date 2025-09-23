import { body } from "express-validator";

export const createUserValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("password").isLength({ min: 6 }),
];