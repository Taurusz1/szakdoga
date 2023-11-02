import SBOMModel from "@/models/sbom_db";
import { connectToDatabase } from "@/utils/localDb";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

const connect = async () => {
  //connectDB();
  await connectToDatabase();
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connect();
  if (req.method === "POST") {
    try {
      const sbom = new SBOMModel(req.body);
      await sbom.save();
      res.status(201).json(req.body);
    } catch (error) {
      console.error("Error creating sbom:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
