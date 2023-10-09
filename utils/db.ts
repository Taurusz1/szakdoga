import mongoose from "mongoose";
import getConfig from "next/config";

const connectDB = async () => {
  const { publicRuntimeConfig } = getConfig();
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(publicRuntimeConfig.MONGOURI);
      console.log("MongoDB connected");
    } else {
      console.log("MongoDB is already connected");
    }
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};

export default connectDB;
