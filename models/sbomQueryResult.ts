import sbom from "./sbom";

type sbomQueryResult = {
    status: number;
    url: string;
    headers: string ;
    data: {
      sbom: sbom;
    };
  };

  export default sbomQueryResult;