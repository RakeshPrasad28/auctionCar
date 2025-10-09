import Car from "../models/car.model.js";
import TryCatch from "../utils/TryCatch.js";

export const createCar = TryCatch(async (req, res) => {
  const { make, model, year } = req.body;
  if (!make || !model || !year) {
    return res.status(400).json({ message: "All fields are required" });
  }
  let car = await Car.findOne({ make, model, year });
  if (car) {
    return res.status(401).json({ message: "Car is already created." });
  }
  car = await Car.create({
    make,
    model,
    year,
  });
  return res.status(200).json({
    message: "car created successfully",
    car: { make: car.make, model: car.model, year: car.year },
  });
});
