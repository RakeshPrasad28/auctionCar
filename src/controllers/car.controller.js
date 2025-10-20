import { uploadToCloudinary } from "../middlewares/dataUri.js";
import Car from "../models/car.model.js";
import TryCatch from "../utils/TryCatch.js";

export const createCar = TryCatch(async (req, res) => {
  const { make, model, year } = req.body;
  const file = req.file;

  if (!make || !model || !year) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!file) {
    res.status(400).json({ message: "No file to upload" });
    return;
  }
  const imageUrl = await uploadToCloudinary(req.file.buffer);
  let car = await Car.findOne({ make, model, year });
  if (car) {
    return res.status(401).json({ message: "Car is already created." });
  }
  car = await Car.create({
    make,
    model,
    year,
    image: imageUrl,
  });
  res.status(200).json({
    message: "car created successfully",
    car,
  });
});

export const getAllCars = async (req, res) => {
  const car = await Car.find();
  res.json(car);
};
