import mongoose, { Schema } from "mongoose";
import SBOMModel from "./sbom_db";

const ResponseHeadersSchema = new Schema({
  "cache-control": { type: String },
  "content-length": { type: Number },
  "content-type": { type: String },
  date: { type: String },
  etag: { type: String },
  "last-modified": { type: String },
  link: { type: String },
  location: { type: String },
  server: { type: String },
  status: { type: String },
  vary: { type: String },
  "x-github-mediatype": { type: String },
  "x-github-request-id": { type: String },
  "x-oauth-scopes": { type: String },
  "x-ratelimit-limit": { type: String },
  "x-ratelimit-remaining": { type: String },
  "x-ratelimit-reset": { type: String },
});

const sbomQueryResultSchema = new Schema({
  status: Number,
  url: String,
  headers: typeof ResponseHeadersSchema,
  data: {
    sbom: typeof SBOMModel,
  },
});

const SBOMQueryResultModel =
  mongoose.models.SBOMQueryResult ||
  mongoose.model("SBOMQueryResult", sbomQueryResultSchema);

export default SBOMQueryResultModel;
