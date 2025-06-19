import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User"; // No file extension needed

import { connectDB } from "./config/db"; // also make sure db.ts uses export

dotenv.config();

const users = [
  {
    firstName: "Alce",
    lastName: "Smth",
    email: "a@example.com",
    passwordHash: "hashedAlice",
    isVerified: true,
  },
  {
    firstName: "Bb",
    lastName: "Joes",
    email: "bob@exaple.com",
    passwordHash: "hashedBob",
    isVerified: false,
  },
];

async function seed(): Promise<void> {
  try {
    await connectDB(); // calls mongoose.connect internally
    await User.insertMany(users); // ✅ now this should work
    console.log("Sample users added");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
