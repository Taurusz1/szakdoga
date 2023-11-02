// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "octokit";
import getConfig from "next/config";
import sbomQueryResult from "@/models/sbomQueryResult";
const { publicRuntimeConfig } = getConfig();

const octokit = new Octokit({
  auth: publicRuntimeConfig.GIT_ACCESS_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<sbomQueryResult>
) {
  const result = await octokit.rest.dependencyGraph.exportSbom({
    mediaType: {
      format: "raw",
    },
    owner: req.body.owner,
    repo: req.body.repo,
  });

  const responseData: sbomQueryResult = {
    status: 200,
    url: `https://api.github.com/repos/${req.body.owner}/${req.body.repo}/dependency-graph/sbom`,
    headers: result.headers,
    data: {
      sbom: result.data.sbom,
    },
  };
  res.status(200).json(responseData);
}
