import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI not defined");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MONGODB SUCCESS");
  
};
