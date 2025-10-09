import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "carAuction" });
    console.log("mongodb is connected");
  } catch (error) {
    console.log("error during db connection", error);
    process.exit(1);
  }
};
