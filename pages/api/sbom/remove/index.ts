import SBOMModel, { sbomSchema } from "@/models/sbom_db";
import { connectToDatabase } from "@/utils/DB/localDb";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

const connect = async () => {
  connectToDatabase();
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connect();
  if (req.method === "POST") {
    try {
      const id: mongoose.Schema.Types.ObjectId = req.body._id!;

      const sbom = await SBOMModel.findByIdAndDelete(id);

      res.json({ message: "SBOM deleted successfully" });
    } catch (error) {
      console.error("Error updating SBOM:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
