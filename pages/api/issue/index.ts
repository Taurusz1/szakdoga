import SecurityAdvisoryModel from "@/models/vuln_db";
import { connectDB } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

const connect = async () => {
  connectDB();
};
export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connect();
  if (req.method === "GET") {
    try {
      const vulnArray = await SecurityAdvisoryModel.find();

      if (!vulnArray) {
        return res.status(404).json({ error: "No SBOM found" });
      }
      res.json(vulnArray);
    } catch (error) {
      console.error("Error retrieving SBOM:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
