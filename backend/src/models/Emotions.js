const mongoose = require("mongoose");

const emotionSchema = new mongoose.Schema({
  emotion: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const Emotion = mongoose.model("Emotion", emotionSchema);

module.exports = Emotion;
