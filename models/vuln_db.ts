import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  login: { type: String, required: false },
  id: { type: Number, required: false },
  node_id: { type: String, required: false },
  avatar_url: { type: String, required: false },
  gravatar_id: { type: String, required: false },
  url: { type: String, required: false },
  html_url: { type: String, required: false },
  followers_url: { type: String, required: false },
  following_url: { type: String, required: false },
  gists_url: { type: String, required: false },
  starred_url: { type: String, required: false },
  subscriptions_url: { type: String, required: false },
  organizations_url: { type: String, required: false },
  repos_url: { type: String, required: false },
  events_url: { type: String, required: false },
  received_events_url: { type: String, required: false },
  type: { type: String, required: false },
  site_admin: { type: Boolean, required: false },
});

const vulnerabilitySchema = new Schema({
  package: {
    ecosystem: { type: String, required: false },
    name: { type: String, required: false },
  },
  vulnerable_version_range: { type: String, required: false },
  patched_versions: { type: String, required: false },
  vulnerable_functions: { type: [String], required: false },
});

const cweSchema = new Schema({
  cwe_id: { type: String, required: false },
  name: { type: String, required: false },
});

const creditSchema = new Schema({
  login: { type: String, required: false },
  type: { type: String, required: false },
});

const creditDetailSchema = new Schema({
  user: userSchema,
  type: { type: String, required: false },
  state: { type: String, required: false },
});

const identifiersSchema = new Schema({
  value: { type: String, required: false },
  type: { type: String, required: false },
});

const securityAdvisorySchema = new Schema({
  ghsa_id: { type: String, required: false },
  cve_id: { type: String, required: false },
  url: { type: String, required: false },
  html_url: { type: String, required: false },
  summary: { type: String, required: false },
  description: { type: String, required: false },
  severity: { type: String, required: false },
  author: { type: String, required: false },
  publisher: userSchema,
  identifiers: [identifiersSchema],
  state: { type: String, required: false },
  created_at: { type: String, required: false },
  updated_at: { type: String, required: false },
  published_at: { type: String, required: false },
  closed_at: { type: String, required: false },
  withdrawn_at: { type: String, required: false },
  submission: { type: String, required: false },
  vulnerabilities: [vulnerabilitySchema],
  cvss: {
    vector_string: { type: String, required: false },
    score: { type: Number, required: false },
  },
  cwes: [cweSchema],
  cwe_ids: { type: [String], required: false },
  credits: [creditSchema],
  credits_detailed: [creditDetailSchema],
  collaborating_users: { type: String, required: false },
  collaborating_teams: { type: String, required: false },
  private_fork: { type: String, required: false },
});

const SecurityAdvisoryModel =
  mongoose.models.SecurityAdvisory ||
  mongoose.model("SecurityAdvisory", securityAdvisorySchema);

export default SecurityAdvisoryModel;
