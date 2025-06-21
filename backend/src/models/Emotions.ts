import mongoose from "mongoose";
import { Document, Schema, Model } from "mongoose";

export interface IEmotion extends Document {
  emotion: string;
  content: string;
  createdAt?: Date;
}

const emotionSchema: Schema<IEmotion> = new Schema({
  emotion: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const Emotion: Model<IEmotion> = mongoose.model<IEmotion>("Emotion", emotionSchema);

export default Emotion;
