import SBOMModel from "@/models/sbom_db";
import connectDB from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

const connect = async () => {
  connectDB();
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connect();
  if (req.method === "POST") {
    try {
      const sbom = new SBOMModel(req.body);
      await sbom.save();
      res.status(201).json(req.body.data.sbom);
    } catch (error) {
      console.error("Error creating sbom:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
