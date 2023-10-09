import mongoose, { Schema } from "mongoose";

const sbomPackageSchema = new Schema({
  SPDXID: { type: String },
  name: { type: String },
  versionInfo: { type: String },
  downloadLocation: { type: String },
  filesAnalyzed: { type: Boolean },
  supplier: { type: String },
  externalRefs: { type: [Object] },
});

const SBOMPackageModel =
  mongoose.models.SBOMPackage ||
  mongoose.model("SBOMPackage", sbomPackageSchema);

export default SBOMPackageModel;
