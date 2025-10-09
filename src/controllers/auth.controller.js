import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import TryCatch from "../utils/TryCatch.js";
import { validationResult } from "express-validator";

export const registerAdmin = TryCatch(async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPass = await bcrypt.hash(password, 10);
  const user = User.create({
    name,
    email,
    role,
    password: hashedPass,
  });
  return res.status(200).json({ message: "register", user });
});

export const getToken = TryCatch(async (req, res) => {
  const { name, password, role } = req.body;
  if (role !== "admin") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const adminUser = await User.findOne({ name, role: "admin" });
  if (!adminUser) {
    return res.status(404).json({ message: "Admin user not found" });
  }

  const isMatch = await bcrypt.compare(password, adminUser.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({
    id: adminUser._id,
    name: adminUser.name,
    role: adminUser.role,
  });
  return res.json({ token });
});

export const registerDealer = TryCatch(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password, role } = req.body;
  if (!email || !name || !role || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (role == "admin") {
    return res.status(400).json({ message: "please select role as dealer" });
  }

  const existingDealer = await User.findOne({ email, role });
  if (existingDealer) {
    return res.status(400).json({ message: "Dealer already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const dealer = new User({
    name,
    email,
    password: hashedPassword,
    role: "dealer",
  });

  await dealer.save();
  return res.status(201).json({
    message: "Dealer registered successfully",
    dealer: { name: dealer.name, email: dealer.email, role: dealer.role },
  });
});

export const loginDealer = TryCatch(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  const dealer = await User.findOne({ email, role: "dealer" });
  if (!dealer) {
    return res.status(404).json({ message: "Dealer not found" });
  }

  const isMatch = await bcrypt.compare(password, dealer.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  return res.status(200).json({
    message: "Login successful",
    dealer: { name: dealer.name, email: dealer.email, role: dealer.role },
  });
});
