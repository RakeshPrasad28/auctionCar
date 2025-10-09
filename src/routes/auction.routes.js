import express from "express";
import auth from "../middlewares/auth.js";
import {
  createAuction,
  endAuction,
  startAuction,
} from "../controllers/auction.controller.js";

const router = express.Router();

router.post("/createAuction", auth, createAuction);
router.patch("/status/:auctionId", auth, startAuction);
router.get("/:auctionId/winner-bid", auth, endAuction);

export default router;
