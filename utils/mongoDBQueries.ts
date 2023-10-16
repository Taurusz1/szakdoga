import getConfig from "next/config";
import sbom from "@/models/sbom";

const { publicRuntimeConfig } = getConfig();

export const UploadSBOMToMongoDB = async (sbom: sbom, parent?: string[]) => {
  //if (sbom.packages.length > 1000) {
  //  console.log("SBOM size exceeds 1Mb, upload is not possible");
  //  return;
  //}
  sbom.parentSBOMName = parent;
  const res = await fetch(publicRuntimeConfig.API_ENDPOINT + "/sbom/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sbom),
  });
};

export const DownloadSBOMsFromMongoDB = async () => {
  const uploadresult = await fetch(publicRuntimeConfig.API_ENDPOINT + "/sbom");
  const data = await uploadresult.json();
  return data;
};

export const DownloadSBOMFromMongoDB = async (id: number) => {
  const uploadresult = await fetch(
    publicRuntimeConfig.API_ENDPOINT + "/sbom/" + id
  );
  const data = await uploadresult.json();
  return data;
};

export const FindIndex = async (sbom: sbom) => {
  const res = await fetch(
    publicRuntimeConfig.API_ENDPOINT + "/sbom/findIndex",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sbom),
    }
  );
  const data = await res.json();
  return data;
};

export const GetLength = async () => {
  const res = await fetch(
    publicRuntimeConfig.API_ENDPOINT + "/sbom/findLength"
  );
  const data = await res.json();
  return data;
};
