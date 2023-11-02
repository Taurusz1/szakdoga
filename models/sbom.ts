import mongoose from "mongoose";
import sbomPackage from "./package";

type sbom = {
  _id?: mongoose.Schema.Types.ObjectId;
  parentSBOMName?: string[];
  instanceCount?: number;
  SPDXID: string;
  spdxVersion: string;
  creationInfo: { created: string; creators: string[] };
  name: string;
  dataLicense: string;
  documentDescribes: string[];
  documentNamespace: string;
  packages: sbomPackage[];
};

export default sbom;
