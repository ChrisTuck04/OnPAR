const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/db");
const { router: authRoutes } = require("./routes/auth");
const emotionRoutes = require("./routes/emotions");
const eventRoutes = require("./routes/events");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());

app.use(express.json());

connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/emotions", emotionRoutes);
app.use("/api/events", eventRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
