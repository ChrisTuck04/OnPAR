import mongoose from "mongoose";
import { Document, Schema, Model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  content: string;
  createdAt?: Date;
}

const eventSchema: Schema<IEvent> = new Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const Event: Model<IEvent> = mongoose.model<IEvent>("Event", eventSchema);

export default Event;
