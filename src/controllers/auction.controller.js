import Auction from "../models/auction.model.js";
import Bid from "../models/bid.model.js";
import Car from "../models/car.model.js";
import User from "../models/user.model.js";
import sendWinnerEmail from "../utils/sendEmail.js";
import TryCatch from "../utils/TryCatch.js";
import { io } from "../config/socket.js";

export const createAuction = TryCatch(async (req, res) => {
  const { startingPrice, startTime, endTime, carId } = req.body;
  const car = await Car.findOne({ _id: carId });
  if (!car) return res.status(404).json({ message: "Car not found" });
  const auction = new Auction({
    startingPrice,
    startTime,
    endTime,
    car: car._id,
    winner: null,
  });
  await auction.save();
  res.status(201).json(auction);
});

export const startAuction = TryCatch(async (req, res) => {
  const { auctionId, newStatus } = req.body;
  const auction = await Auction.findOneAndUpdate(
    { _id: auctionId },
    { auctionStatus: newStatus },
    { new: true }
  );
  if (!auction) return res.status(404).json({ message: "Auction not found" });
  res.json(auction);
});

export const endAuction = TryCatch(async (req, res) => {
  const { auctionId } = req.params;
  const auction = await Auction.findOne({ _id: auctionId });
  if (!auction) return res.status(404).json({ message: "Auction not found" });

  if (auction.auctionStatus === "ended") {
    return res.status(400).json({ message: "Auction already ended" });
  }

  const highestBid = await Bid.find({ auction: auction._id })
    .sort({ bidAmount: -1 })
    .limit(1)
    .populate("dealer");
  if (!highestBid.length) return res.status(404).json({ message: "No bids" });

  const winningBid = highestBid[0];
  const dealer = await User.findById(winningBid.dealer);
  const car = await Car.findById(auction.car);
  console.log(auction, car);

  auction.winner = dealer._id;
  auction.winnerPrice = winningBid.bidAmount;
  auction.auctionStatus = "ended";
  await auction.save();

  await sendWinnerEmail(
    dealer.email,
    `${car.make} ${car.model} (${car.year})`,
    auctionId
  );
  res.json({
    message: "Auction ended successfully",
    winner: dealer.name,
    bid: winningBid.bidAmount,
  });
});

export const getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find().populate("car");
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getSingleAuction = TryCatch(async (req, res) => {
  const { auctionId } = req.params;
  // console.log(auctionId)
  const auction = await Auction.findById(auctionId).populate("car");
  if (!auction) {
    return res.status(404).json({ message: "Auction not found" });
  }
  res.json(auction);
});
