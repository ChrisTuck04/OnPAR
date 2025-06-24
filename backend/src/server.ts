const express = require("express");
const cors = require("cors");
require("dotenv").config();
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";

const app = express();
const PORT: number = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
connectDB();
app.use("/auth", authRoutes); // Login/Register

app.get("/", (req: any, res: any) => {
  res.send("API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
