import PackageNamesArrayModel from "@/models/package_names_db";
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/utils/db";

const connect = async () => {
  connectDB();
};
export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connect();
  if (req.method === "GET") {
    try {
      const package_names = await PackageNamesArrayModel.find();

      if (!package_names) {
        return res.status(404).json({ error: "SBOM not found" });
      }
      res.json(package_names[0].packageNames);
    } catch (error) {
      console.error("Error retrieving SBOM:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
