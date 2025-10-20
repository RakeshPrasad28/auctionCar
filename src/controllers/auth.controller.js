import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import TryCatch from "../utils/TryCatch.js";
import { validationResult } from "express-validator";

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

export const loginUser = TryCatch(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, role } = req.body;

  const user = await User.findOne({ email, role });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  let isMatch = false;
  if (role === "admin") {
    isMatch = password === user.password;
  } else {
    isMatch = await bcrypt.compare(password, user.password);
  }

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({
    id: user._id,
    name: user.name,
    role: user.role,
    email: user.email,
  });

  const { password: pwd, ...userData } = user.toObject();
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    message: "Login successful",
    user: userData,
    token,
  });
});

export const authMe = TryCatch(async (req, res) => {
  res.json(req.user);
});
