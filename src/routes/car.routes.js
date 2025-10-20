import express from "express";
import { createCar, getAllCars } from "../controllers/car.controller.js";
import { adminAuth } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/create-car", adminAuth, upload.single("image"), createCar);
router.get("/getAllCars", adminAuth, getAllCars);

export default router;
