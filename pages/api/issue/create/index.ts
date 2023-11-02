import SecurityAdvisoryModel from "@/models/vuln_db";
import { connectDB } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

const connect = async () => {
  connectDB();
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connect();
  if (req.method === "POST") {
    try {
      const vuln = new SecurityAdvisoryModel(req.body);
      await vuln.save();
      res.status(201).json(req.body);
    } catch (error) {
      console.error("Error creating sbom:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
