const uri = "mongodb://127.0.0.1:27017/szakdoga";
import mongoose from "mongoose";

export async function connectToDatabase() {
  await mongoose.connect(uri);
}
