import packageNamesArray from "@/models/package_names";
import PackageNamesArrayModel from "@/models/package_names_db";
import connectDB from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

const connect = async () => {
  connectDB();
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connect();

  if (req.method === "POST") {
    const packageNames = req.body;
    const packageNamesData: packageNamesArray = {
      packageNames,
    };
    try {
      const package_names = new PackageNamesArrayModel(packageNamesData);
      await package_names.save();
      res.status(201).json(package_names);
    } catch (error) {
      console.error("Error creating packageNames:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
