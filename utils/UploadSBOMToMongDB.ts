import getConfig from "next/config";
import sbom from "@/models/sbom";

const { publicRuntimeConfig } = getConfig();

const UploadSBOMToMongoDB = async (sbom: sbom) => {
  if (sbom.packages.length > 1000) {
    console.log("SBOM size exceeds 1Mb, upload is not possible");
    return;
  }

  const res = await fetch(publicRuntimeConfig.API_ENDPOINT + "/sbom/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sbom),
  });
  console.log("Upload to DB: Success");
};

export default UploadSBOMToMongoDB;
