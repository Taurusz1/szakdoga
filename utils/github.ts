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
  const ghsaIDsTier1 = [
    "GHSA-q78c-gwqw-jcmc",
    "GHSA-35c7-w35f-xwgh",
    "GHSA-qc2g-gmh6-95p4",
    "GHSA-cgcv-5272-97pr",
    "GHSA-jh36-q97c-9928",
    "GHSA-xc8m-28vv-4pjc",
    "GHSA-2394-5535-8j88",
    "GHSA-wqwf-x5cj-rg56",
    "GHSA-f9jg-8p32-2f55",
    "GHSA-g42g-737j-qx6j",
    "GHSA-pmqp-h87c-mr78",
  ];
  const ghsaIDsTier2 = [
    "GHSA-6xv5-86q9-7xr8",
    "GHSA-r48q-9g5r-8q2h",
    "GHSA-gxhv-3hwf-wjp9",
    "GHSA-679h-84ch-2wh9",
    "GHSA-p54v-5qqx-fv5f",
    "GHSA-c3h9-896r-86jm",
    "GHSA-hw7c-3rfg-p46j",
    "GHSA-3xh2-74w9-5vxm",
    "GHSA-vpvm-3wq2-2wvm",
    "GHSA-fgv8-vj5c-2ppq",
    "GHSA-gp4j-w3vj-7299",
    "GHSA-q3j5-32m5-58c2",
    "GHSA-58v3-j75h-xr49",
  ];

  const vulns = [];
  for (let i = 0; i < ghsaIDsTier2.length; i++) {
    const res = await fetch(
      publicRuntimeConfig.API_ENDPOINT + "/issue/github/global",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ghsaID: ghsaIDsTier2[i] }),
      }
    );
    const resData = await res.json();
    vulns.push(resData.data[0]);
  }
  return vulns;
}

export async function GetReleases(name: string[]) {
  const releaseData: Release[] = [];
  const pageNumber = 8;
  for (let i = 0; i < pageNumber; i++) {
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
