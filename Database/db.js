import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected to the mongodb database");
  } catch (error) {

    console.error("Error connecting to the mongodb database", error.message)
  }
};

export default connectDB;
