import mongoose, { Schema } from "mongoose";
import SBOMModel from "./sbom_db";
import ResponseHeadersModel from "./ResponseHeaders_db";

const sbomQueryResultSchema = new Schema({
  status: Number,
  url: String,
  headers: typeof ResponseHeadersModel,
  data: {
    sbom: typeof SBOMModel,
  },
});

const SBOMQueryResultModel = mongoose.model(
  "SBOMQueryResult",
  sbomQueryResultSchema
);

export default SBOMQueryResultModel;
