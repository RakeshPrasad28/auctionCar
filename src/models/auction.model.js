import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  auctionStatus: {
    type: String,
    enum: ["pending", "active", "ended"],
    default: "pending",
  },
  startingPrice: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
},{timestamps:true});

const Auction =  mongoose.model("Auction", auctionSchema);
export default Auction;
