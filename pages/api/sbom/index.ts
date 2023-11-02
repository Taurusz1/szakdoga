import SBOMModel, { sbomSchema } from "@/models/sbom_db";
import { connectDB, disconnectDB } from "@/utils/DB/db";
import { connectToDatabase } from "@/utils/DB/localDb";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

const connect = async () => {
  //connectDB();
  connectToDatabase();
};
export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connect();
  if (req.method === "GET") {
    try {
      const sbomArray = await SBOMModel.find();

      if (!sbomArray) {
        return res.status(404).json({ error: "No SBOM found" });
      }
      disconnectDB();
      res.json(sbomArray);
    } catch (error) {
      console.error("Error retrieving SBOM:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
