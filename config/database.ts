import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_ADMIN}:${process.env.MONGODB_PASS}@getwith-cluster.2aufmye.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority&appName=getwith-cluster`
    );
    console.log("Database connection successfully.");
  } catch (err) {
    console.log("Database not connected.", err);
  }
};
