import mongoose from "mongoose";
const uri = "mongodb://127.0.0.1:27017/szakdoga";

export async function connectToDatabase() {
  await mongoose.connect(uri);
  console.log("LocalDB Connected");
}
