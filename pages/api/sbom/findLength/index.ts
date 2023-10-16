import connectDB from "@/utils/db";
import SBOMModel from "@/models/sbom_db";
import { NextApiRequest, NextApiResponse } from "next";

const connect = async () => {
  connectDB();
};
export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connect();
  if (req.method === "GET") {
    try {
      const sbomArray = await SBOMModel.find();
      if (!sbomArray) {
        return res.status(404).json({ error: "No SBOM found" });
      }
      const length = sbomArray.length;
      res.json(length);
    } catch (error) {
      console.error("Error retrieving SBOM:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
