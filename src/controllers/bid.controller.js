import Auction from "../models/auction.model.js";
import Bid from "../models/bid.model.js";
import User from "../models/user.model.js";
import TryCatch from "../utils/TryCatch.js";

export const placeBid = TryCatch(async (req, res) => {
  const { bidAmount, dealerId, auctionId } = req.body;
  const dealer = await User.findOne({ _id: dealerId });
  if (!dealer) return res.status(404).json({ message: "Dealer not found" });

  if (dealer.role !== "dealer") {
    return res
      .status(403)
      .json({ message: "User is not authorized to place a bid" });
  }

  const auction = await Auction.findOne({ _id: auctionId });
  if (!auction || auction.auctionStatus !== "active")
    return res.status(400).json({ message: "Auction not active" });

  const prevBid = await Bid.find({ auction: auction._id })
    .sort({ bidAmount: -1 })
    .limit(1);
  const previousBid = prevBid.length
    ? prevBid[0].bidAmount
    : auction.startingPrice;

  if (bidAmount <= previousBid)
    return res
      .status(400)
      .json({ message: "Bid amount must be higher than previous bid" });
  const newBid = new Bid({
    bidAmount,
    previousBid,
    dealer: dealer._id,
    auction: auction._id,
  });
  await newBid.save();
  res.status(201).json(newBid);
});
