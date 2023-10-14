import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const DownloadSBOMQueryResultFromGithub = async (
  owner: String,
  repo: String
) => {
  try {
    const dataObject = {
      owner: owner,
      repo: repo,
    };
    const resSBOM = await fetch(publicRuntimeConfig.API_ENDPOINT + "/sbom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataObject),
    });
    const dataSBOM = await resSBOM.json();
    return dataSBOM;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export default DownloadSBOMQueryResultFromGithub;
