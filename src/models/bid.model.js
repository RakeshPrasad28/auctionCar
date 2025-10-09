import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  bidAmount: { type: Number, required: true },
  previousBid: { type: Number },
  timePlaced: { type: Date, default: Date.now },
  dealer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction" },
},{timestamps:true});

const Bid =  mongoose.model("Bid", bidSchema);
export default Bid;
