import connectDB from "@/utils/db";
import SBOMModel from "@/models/sbom_db";
import { NextApiRequest, NextApiResponse } from "next";

const connect = async () => {
  connectDB();
};
export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connect();
  const { id } = req.query;
  if (req.method === "GET") {
    try {
      const sbom = await SBOMModel.findById(id);

      if (!sbom) {
        return res.status(404).json({ error: "SBOM not found" });
      }
      res.json(sbom);
    } catch (error) {
      console.error("Error retrieving SBOM:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
