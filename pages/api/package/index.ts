import connectDB from "@/utils/db";
import PackageNamesArrayModel from "@/models/package_names_db";
import { NextApiRequest, NextApiResponse } from "next";
import packageNamesArray from "@/models/package_names";

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
      const packages = splitArrayIntoChunks(package_names, 100);
      res.json(packages);
    } catch (error) {
      console.error("Error retrieving SBOM:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};

function splitArrayIntoChunks(array: packageNamesArray[], chunkSize: number) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
}
