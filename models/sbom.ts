import sbomPackage from "./package";

type sbom = {
  SPDXID: string;
  spdxVersion: string;
  creationInfo: { created: string; creators: string[] };
  name: string;
  dataLicense: string;
  documentDescribes: string[];
  documentNamespace: string;
  packages: sbomPackage[];
};

export default sbom;
