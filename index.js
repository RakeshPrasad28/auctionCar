import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from 'cors';
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import { connectDB } from "./src/config/db.js";
import auctionRoutes from "./src/routes/auction.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import carRoutes from "./src/routes/car.routes.js";
import bidRoutes from "./src/routes/bid.routes.js";

const app = express();
app.use(cors());
app.use(helmet());
const port = process.env.PORT || 5000;
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// app.use(mongoSanitize());
app.use(express.json());

app.use("/api/v1/auction", auctionRoutes);
app.use("/api/v1/auction", authRoutes);
app.use("/api/v1/car", carRoutes);
app.use("/api/v1/bid", bidRoutes);

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
  connectDB();
});
