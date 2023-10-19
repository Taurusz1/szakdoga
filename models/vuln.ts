type Vulnerability = {
  package?: {
    ecosystem?: string;
    name?: string;
  };
  vulnerable_version_range?: string;
  patched_versions?: string;
  vulnerable_functions?: string[];
};

type CWE = {
  cwe_id?: string;
  name?: string;
};

type Credit = {
  login?: string;
  type?: string;
};

type User = {
  login?: string;
  id?: number;
  node_id?: string;
  avatar_url?: string;
  gravatar_id?: string;
  url?: string;
  html_url?: string;
  followers_url?: string;
  following_url?: string;
  gists_url?: string;
  starred_url?: string;
  subscriptions_url?: string;
  organizations_url?: string;
  repos_url?: string;
  events_url?: string;
  received_events_url?: string;
  type?: string;
  site_admin?: boolean;
};

type CreditDetail = {
  user?: User;
  type?: string;
  state?: string;
};

type SecurityAdvisory = {
  ghsa_id?: string;
  cve_id?: string;
  url?: string;
  html_url?: string;
  summary?: string;
  description?: string;
  severity?: string;
  author?: string | null;
  publisher?: {
    login?: string;
    id?: number;
    node_id?: string;
    avatar_url?: string;
    gravatar_id?: string;
    url?: string;
    html_url?: string;
    followers_url?: string;
    following_url?: string;
    gists_url?: string;
    starred_url?: string;
    subscriptions_url?: string;
    organizations_url?: string;
    repos_url?: string;
    events_url?: string;
    received_events_url?: string;
    type?: string;
    site_admin?: boolean;
  };
  identifiers?: {
    value?: string;
    type?: string;
  }[];
  state?: string;
  created_at?: string | null;
  updated_at?: string;
  published_at?: string;
  closed_at?: string | null;
  withdrawn_at?: string | null;
  submission?: string | null;
  vulnerabilities?: Vulnerability[];
  cvss?: {
    vector_string?: string | null;
    score?: number | null;
  };
  cwes?: CWE[];
  cwe_ids?: string[];
  credits?: Credit[];
  credits_detailed?: CreditDetail[];
  collaborating_users?: string | null;
  collaborating_teams?: string | null;
  private_fork?: string | null;
};

export default SecurityAdvisory;
