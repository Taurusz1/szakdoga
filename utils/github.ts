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
  const ghsaIDsTier3 = [
    "GHSA-7f33-f4f5-xwgw",
    "GHSA-76wf-9vgp-pj7w",
    "GHSA-f5pg-7wfw-84q9",
    "GHSA-6jvc-q2x7-pchv",
  ];
  const ghsaIDsRunc = [
    "GHSA-g2j6-57v7-gm8c",
    "GHSA-m8cg-xc2p-r3fc",
    "GHSA-vpvm-3wq2-2wvm",
    "GHSA-f3fp-gc8g-vw66",
    "GHSA-fgv8-vj5c-2ppq",
    "GHSA-gp4j-w3vj-7299",
    "GHSA-q3j5-32m5-58c2",
    "GHSA-v95c-p5hm-xq8f",
    "GHSA-fh74-hm69-rqjw",
    "GHSA-c3xm-pvg7-gh7r",
    "GHSA-g54h-m393-cpwq",
  ];

  const ghsaIDsMoby = [
    "GHSA-vp35-85q5-9f25",
    "GHSA-rc4r-wh2q-q6c4",
    "GHSA-v4h8-794j-g8mm",
    "GHSA-8fvr-5rqf-3wwh",
  ];
  const ghsaIDsContainerd = [
    "GHSA-259w-8hf6-59c2",
    "GHSA-hmfx-3pcx-653p",
    "GHSA-2qjp-425j-52j9",
    "GHSA-5ffw-gxpp-mxpf",
    "GHSA-crp2-qrr5-8pq7",
    "GHSA-742w-89gc-8m9c",
    "GHSA-mvff-h3cj-wj9c",
    "GHSA-5j5w-g665-5m35",
    "GHSA-c2h3-6mxw-7mvq",
    "GHSA-c72p-9xmj-rx3w",
    "GHSA-36xw-fx78-c5r4",
  ];
  const ghsaIDsDistribution = [];

  const vulns = [];
  for (let i = 0; i < ghsaIDsContainerd.length; i++) {
    const res = await fetch(
      publicRuntimeConfig.API_ENDPOINT + "/issue/github/global",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ghsaID: ghsaIDsContainerd[i] }),
      }
    );
    const resData = await res.json();
    vulns.push(resData.data[0]);
  }
  return vulns;
}

export async function GetReleases(name: string[]) {
  const releaseData: Release[] = [];
  const pageNumber = 5;
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
