import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MONGODB SUCCESS")
    } catch (error) {
        console.error("Error connecting", error);
        process.exit(1); // exit with failure
    }
}