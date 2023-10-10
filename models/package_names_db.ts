import mongoose, { Schema } from "mongoose";

const packageNamesSchema = new mongoose.Schema({
  packageNames: [[String]],
});

const PackageNamesModel =
  mongoose.models.PackageNames ||
  mongoose.model("PackageNames", packageNamesSchema);

export default PackageNamesModel;
