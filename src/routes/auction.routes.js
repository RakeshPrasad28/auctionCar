import express from "express";
import {adminAuth, auth} from "../middlewares/auth.js";
import {
  createAuction,
  endAuction,
  getAllAuctions,
  getSingleAuction,
  startAuction,
} from "../controllers/auction.controller.js";

const router = express.Router();

router.post("/createAuction", adminAuth, createAuction);
router.patch("/changeStatus", adminAuth, startAuction);
router.get("/getAllAuction", getAllAuctions);
router.get("/getAuction/:auctionId", auth, getSingleAuction);
router.get("/:auctionId/winner-bid", adminAuth, endAuction);

export default router;
