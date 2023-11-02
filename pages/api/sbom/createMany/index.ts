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
  //connectDB();
  connectToDatabase();
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connect();
  if (req.method === "POST") {
    console.log("asd");
  }
};
