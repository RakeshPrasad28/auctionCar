import express from "express";
import { getBid, placeBid } from "../controllers/bid.controller.js";
import {adminAuth, auth} from "../middlewares/auth.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const placeBidLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 1,
  message:
    "You can only place a bid once per 10 sec. Please wait before trying again.",
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/placeBids", auth, placeBidLimiter, placeBid);
router.post("/getBid", auth, getBid);

export default router;
