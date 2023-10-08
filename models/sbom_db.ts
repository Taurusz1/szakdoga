import mongoose, { Schema } from "mongoose";
import SBOMPackageModel from "./package_db";

const creationInfoSchema = new Schema({
  created: { type: String, required: true },
  creators: { type: [String], required: true },
});

const sbomSchema = new Schema({
  SPDXID: String,
  spdxVersion: String,
  creationInfo: creationInfoSchema,
  name: String,
  dataLicense: String,
  documentDescribes: [String],
  documentNamespace: String,
  packages: [SBOMPackageModel],
});

const SBOMModel = mongoose.model("SBOM", sbomSchema);

export default SBOMModel;
