import mongoose, { Schema } from "mongoose";

const securityAdvisorySchema = new Schema({
  ghsa_id: String,
  cve_id: String,
  url: String,
  html_url: String,
  summary: String,
  description: String,
  severity: String,
  author: String,
  publisher: {
    login: String,
    id: Number,
    node_id: String,
    avatar_url: String,
    gravatar_id: String,
    url: String,
    html_url: String,
    followers_url: String,
    following_url: String,
    gists_url: String,
    starred_url: String,
    subscriptions_url: String,
    organizations_url: String,
    repos_url: String,
    events_url: String,
    received_events_url: String,
    type: String,
    site_admin: Boolean,
  },
  identifiers: [
    {
      value: String,
      type: String,
    },
  ],
  state: String,
  created_at: String,
  updated_at: String,
  published_at: String,
  closed_at: String,
  withdrawn_at: String,
  submission: String,
  vulnerabilities: [
    {
      package: {
        ecosystem: String,
        name: String,
      },
      vulnerable_version_range: String,
      patched_versions: String,
      vulnerable_functions: [String],
    },
  ],
  cvss: {
    vector_string: String,
    score: Number,
  },
  cwes: [
    {
      cwe_id: String,
      name: String,
    },
  ],
  cwe_ids: [String],
  credits: [
    {
      login: String,
      type: String,
    },
  ],
  credits_detailed: [
    {
      user: {
        login: String,
        id: Number,
        node_id: String,
        avatar_url: String,
        gravatar_id: String,
        url: String,
        html_url: String,
        followers_url: String,
        following_url: String,
        gists_url: String,
        starred_url: String,
        subscriptions_url: String,
        organizations_url: String,
        repos_url: String,
        events_url: String,
        received_events_url: String,
        type: String,
        site_admin: Boolean,
      },
      type: String,
      state: String,
    },
  ],
  collaborating_users: String,
  collaborating_teams: String,
  private_fork: String,
});

const SecurityAdvisoryModel =
  mongoose.models.SecurityAdvisory ||
  mongoose.model("SecurityAdvisory", securityAdvisorySchema);

module.exports = SecurityAdvisoryModel;
