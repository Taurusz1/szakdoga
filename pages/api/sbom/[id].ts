import connectDB from "@/utils/db";
import SBOMModel from "@/models/sbom_db";
import { NextApiRequest, NextApiResponse } from "next";
import sbomQueryResult from "@/models/sbomQueryResult";

const connect = async () => {
  connectDB();
};
export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connect();
  const id = req.query.id as string | undefined;
  if (req.method === "GET") {
    if (id === undefined) {
      return res.status(400).json({ error: "Index parameter is missing" });
    }
    try {
      const parsedIndex = parseInt(id, 10); // Convert index to integer
      const sbom = await SBOMModel.find().skip(parsedIndex).limit(1);

      if (!sbom) {
        return res.status(404).json({ error: "SBOM not found" });
      }
      res.json(sbom[0]);
    } catch (error) {
      console.error("Error retrieving SBOM:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
