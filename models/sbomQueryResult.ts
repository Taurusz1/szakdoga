import { ResponseHeaders } from "./ResponseHeaders";
import sbom from "./sbom";

type sbomQueryResult = {
  status: number;
  url: string;
  headers: ResponseHeaders;
  data: {
    sbom: sbom;
  };
};

export default sbomQueryResult;
