import express from "express";
import { body } from "express-validator";
import {
  getToken,
  loginDealer,
  registerDealer,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/token", getToken);
router.post(
  "/register-dealer",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role").equals("dealer").withMessage("Role must be 'dealer'"),
  ],
  registerDealer
);

router.post(
  "/login-dealer",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  loginDealer
);

export default router;
