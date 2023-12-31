import { sbomSchema } from "@/models/sbom_db";
import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { connectToDatabase } from "@/utils/DB/localDb";

const connect = async () => {
  connectToDatabase();
};
export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connect();
  if (req.method === "POST") {
    try {
      const name = req.body;
      const SBOMModel = mongoose.model("EverySBOMOnlyOnce", sbomSchema);
      const matchingSBOM = await SBOMModel.findOne({ name });

      if (!matchingSBOM) {
        return res.json(null);
      }

      res.json(matchingSBOM);
    } catch (error) {
      console.error("Error retrieving SBOM:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
