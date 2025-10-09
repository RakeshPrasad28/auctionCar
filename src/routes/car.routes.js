import express from "express";
import { createCar } from "../controllers/car.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-car",auth, createCar);

export default router;
