import mongoose, { Schema } from "mongoose";

const creationInfoSchema = new Schema({
  created: { type: String, required: true },
  creators: { type: [String], required: true },
});

const sbomPackageSchema = new Schema({
  parentSBOMName: { type: [String], required: false },
  SPDXID: { type: String },
  name: { type: String },
  versionInfo: { type: String },
  downloadLocation: { type: String },
  filesAnalyzed: { type: Boolean },
  supplier: { type: String },
  externalRefs: { type: [Object] },
});

const sbomSchema = new Schema(
  {
    parentSBOMName: [String],
    SPDXID: String,
    spdxVersion: String,
    creationInfo: creationInfoSchema,
    name: String,
    dataLicense: String,
    documentDescribes: [String],
    documentNamespace: String,
    packages: [sbomPackageSchema],
  },
  { collection: "EverySBOMOnlyOnce" }
);

const SBOMModel = mongoose.models.SBOM || mongoose.model("SBOM", sbomSchema);

export default SBOMModel;
