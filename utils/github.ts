import { Release } from "@/models/release";
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

export const GetRepoVulns = async (repoData: string[]) => {
  const res = await fetch(
    publicRuntimeConfig.API_ENDPOINT + "/issue/github/repo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(repoData),
    }
  );
  const data = await res.json();
  return data.data;
};

export async function GetGlobalVulns(repoData: string[]) {
  const res = await fetch(
    publicRuntimeConfig.API_ENDPOINT + "/issue/github/global",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(repoData),
    }
  );
  const resData = await res.json();
  return resData.data;
}

export async function GetReleases(name: string[]) {
  const releaseData: Release[] = [];
  for (let i = 0; i < 8; i++) {
    const res = await fetch(
      publicRuntimeConfig.API_ENDPOINT + `/sbom/github/listReleases`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ owner: name[0], repo: name[1], pageNum: i }),
      }
    );
    const resData = await res.json();
    releaseData.push(...resData);
  }
  return releaseData;
}
