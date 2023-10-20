import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const DownloadSBOMFromGithub = async (owner: String, repo: String) => {
  try {
    const dataObject = {
      owner: owner,
      repo: repo,
    };
    const resSBOM = await fetch(
      publicRuntimeConfig.API_ENDPOINT + "/sbom/github",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataObject),
      }
    );
    const dataSBOM = await resSBOM.json();
    const sbom = dataSBOM.data.sbom;
    return sbom;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const DownloadVulnFromGithub = async (repoData: string[]) => {
  const res = await fetch(publicRuntimeConfig.API_ENDPOINT + "/sbom/issues", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(repoData),
  });
  const data = await res.json();
  return data.data;
};
