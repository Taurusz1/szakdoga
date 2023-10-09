import sbom from "@/models/sbom";
import SBOMModel from "@/models/sbom_db";
import connectDB from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

const connect = async () => {
  connectDB();
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await connect();

  if (req.method === "POST") {
    const {
      SPDXID,
      spdxVersion,
      creationInfo,
      name,
      dataLicense,
      documentDescribes,
      documentNamespace,
      packages,
    } = req.body;

    const sbomData: sbom = {
      SPDXID,
      spdxVersion,
      creationInfo,
      name,
      dataLicense,
      documentDescribes,
      documentNamespace,
      packages,
    };
    try {
      const sbom = new SBOMModel(sbomData);
      await sbom.save();
      res.status(201).json(sbom);
    } catch (error) {
      console.error("Error creating sbom:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
