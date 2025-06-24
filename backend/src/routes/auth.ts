import express, { Request, Response } from "express";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import User from "../models/User";
require("dotenv").config();

const router = express.Router();

// Register API
router.post("/register", async (req: Request, res: Response): Promise<void> =>
{
  const { firstName, lastName, email, password } = req.body;

  try
  {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
    {
        res.status(409).json({ error: "Email already registered" });
        return;
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      passwordHash: hashedPassword,
      isVerified: false,
    });

    // Save User to DB
    const savedUser = await newUser.save();
    res.status(201).json({ message: `User ${savedUser.email} registered successfully` });
  }
  catch (error)
  {
    console.error(error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login API
router.post("/login", async (req: Request, res: Response): Promise<void> =>
{
  const { email, password } = req.body;

  try
  {
    const user = await User.findOne({ email });
    if (!user)
    {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid)
    {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  }
  catch (error)
  {
    res.status(500).json({ error: "Failed to log in" });
  }
});

export default router;