import Auction from "../models/auction.model.js";
import Bid from "../models/bid.model.js";
import Car from "../models/car.model.js";
import User from "../models/user.model.js";
import sendWinnerEmail from "../utils/sendEmail.js";
import TryCatch from "../utils/TryCatch.js";

export const createAuction = TryCatch(async (req, res) => {
  const { startingPrice, startTime, endTime, carId } = req.body;
  const car = await Car.findOne({ _id:carId });
  if (!car) return res.status(404).json({ message: "Car not found" });
  const auction = new Auction({
    startingPrice,
    startTime,
    endTime,
    car: car._id,
  });
  await auction.save();
  res.status(201).json(auction);
});

export const startAuction = TryCatch(async (req, res) => {
  const { auctionId } = req.params;
  const auction = await Auction.findOneAndUpdate(
    { _id: auctionId },
    { auctionStatus: "active" },
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

  auction.auctionStatus = "ended";
  await auction.save();

  const highestBid = await Bid.find({ auction: auction._id })
    .sort({ bidAmount: -1 })
    .limit(1)
    .populate("dealer");
  if (!highestBid.length) return res.status(404).json({ message: "No bids" });

  const dealer = await User.findById(highestBid[0].dealer);
  const car = await Car.findById(auction.car);
  console.log(auction,car)

  await sendWinnerEmail(
    dealer.email,
    `${car.make} ${car.model} (${car.year})`,
    auctionId
  );
  res.json({ winner: dealer.name, bid: highestBid[0].bidAmount });
});
