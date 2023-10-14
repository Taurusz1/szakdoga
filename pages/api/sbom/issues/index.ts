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
  res: NextApiResponse
) {
  const data = await octokit.rest.securityAdvisories.listRepositoryAdvisories({
    owner: "Taurusz1",
    repo: "Bom-to-CVE",
  });
  console.log(data.data);

  res.status(200).json(data);
}
