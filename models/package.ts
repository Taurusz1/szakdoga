type sbomPackage = {
  SPDXID?: string;
  name?: string;
  versionInfo?: string;
  downloadLocation?: string;
  filesAnalyzed?: boolean;
  supplier?: string;
  externalRefs?: any[];
};

export default sbomPackage;
