const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  startTime: { type: Date },
  endTime: { type: Date },
  recurring: { type: Boolean },
  userId: { type: mongoose.Schema.Types.ObjectId },
  sharedEmails: { type: [String] },
  color: { type: Number },
  recurDays: {type: [Number]},
  recurEnd: {type: Date}
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
