type SBOM = {
  status: number;
  url: string;
  headers: string ;
  data: {
    sbom: {
      SPDXID: string;
      spdxVersion: string;
      creationInfo: { created: string; creators: string[] };
      name: string;
      dataLicense: string;
      documentDescribes: string[];
      documentNamespace: string;
      packages: any[]; // Define the type for Package if needed
    };
  };
};

export default SBOM;