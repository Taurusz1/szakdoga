import mongoose, { Schema } from "mongoose";

const responseHeadersSchema = new Schema({
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

const ResponseHeadersModel =
  mongoose.models.ResponseHeaders ||
  mongoose.model("ResponseHeaders", responseHeadersSchema);

export default ResponseHeadersModel;
