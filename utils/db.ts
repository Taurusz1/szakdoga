import mongoose from "mongoose";
import getConfig from "next/config";

export const connectDB = async () => {
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

export async function disconnectDB() {
  try {
    if (mongoose.connection.readyState == 1) {
      await mongoose.disconnect();
      console.log("MongoDB disconnected");
    } else {
      console.log("MongoDB is already disconnected");
    }
  } catch (err) {
    console.error("MongoDB disconnection failed:", err);
  }
}
