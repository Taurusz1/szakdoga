// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "octokit";
import getConfig from "next/config";
import sbomQueryResult from "@/models/sbomQueryResult";
import sbom from "@/models/sbom";
import sbomPackage from "@/models/package";
const { publicRuntimeConfig } = getConfig();

const octokit = new Octokit({
  auth: publicRuntimeConfig.GIT_ACCESS_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<sbomQueryResult>
) {
  const result = await queryData("kubernetes", "Kubernetes");
  const packageData = filterSbom(result);
  packageData.map((p) => {
    return queryData(p[0], p[1]);
  });
  console.log(packageData[0]);
  const responseData: sbomQueryResult = {
    status: 200,
    url: "https://api.github.com/repos/kubernetes/Kubernetes/dependency-graph/sbom",
    headers: result.headers,
    data: {
      sbom: result.data.sbom,
    },
  };
  res.status(200).json(responseData);
}

const queryData = async (owner: string, repo: string) => {
  const result = await octokit.rest.dependencyGraph.exportSbom({
    mediaType: {
      format: "raw",
    },
    owner: owner,
    repo: repo,
  });
  return result;
};

const filterSbom = (sbomQueryResult: sbomQueryResult) => {
  const sbom = sbomQueryResult.data.sbom;
  const packageNames = sbom.packages?.map((p: sbomPackage) => p.name!).sort();

  const githubLinks = packageNames.filter((str) =>
    str.startsWith("go:github.com")
  );
  const nonGithubLinks = packageNames.filter(
    (str) => !str.startsWith("go:github.com")
  );
  const splitGithubLinks = githubLinks.map((g) => formatGithubLinks(g));
  return splitGithubLinks;
};

const formatGithubLinks = (link: String) => {
  // Splits the string and only keeps the account and repo name
  const [account, repo] = link.split("/").splice(1, 2);
  const uniqueParts = [...new Set([account, repo])];
  return uniqueParts;
};
