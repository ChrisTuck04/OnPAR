const mongoose = require("mongoose");

const emotionSchema = new mongoose.Schema({
  emotion: { type: String, required: true, trim: true },
  title : {type : String, required : true, trim : true, default : ""},
  leftContent: { type: String, trim: true, default: "" },
  rightContent: { type: String, trim: true, default: "" },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  sharedEmails: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const Emotion = mongoose.model("Emotion", emotionSchema);

module.exports = Emotion;
