import getConfig from "next/config";
import sbom from "@/models/sbom";
import SecurityAdvisory from "@/models/vuln";

const { publicRuntimeConfig } = getConfig();

export const SetSBOMToMongoDB = async (sbom: sbom, parent?: string[]) => {
  if (parent) {
    sbom.parentSBOMName = parent;
  }
  const res = await fetch(publicRuntimeConfig.API_ENDPOINT + "/sbom/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sbom),
  });
};
export const UpdateSBOMToMongoDB = async (sbom: sbom) => {
  const res = await fetch(publicRuntimeConfig.API_ENDPOINT + "/sbom/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sbom),
  });
};

export const GetSBOMsFromMongoDB = async () => {
  const uploadresult = await fetch(publicRuntimeConfig.API_ENDPOINT + "/sbom");
  const data = await uploadresult.json();
  return data;
};

export const GetSBOMFromMongoDB = async (id: number) => {
  const uploadresult = await fetch(
    publicRuntimeConfig.API_ENDPOINT + "/sbom/" + id
  );
  const data = await uploadresult.json();
  return data;
};

export const GetSBOMFromMongoDBByName = async (name: string) => {
  const uploadresult = await fetch(
    publicRuntimeConfig.API_ENDPOINT + "/sbom/FindByName",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(name),
    }
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

export const SetVulnToMongoDB = async (vuln: SecurityAdvisory) => {
  const res = await fetch(publicRuntimeConfig.API_ENDPOINT + "/issues/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vuln),
  });
};

export const GetVulns = async () => {
  try {
    const res = await fetch(publicRuntimeConfig.API_ENDPOINT + "/issue");

    if (!res.ok) {
      throw new Error(`Request failed with status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};
