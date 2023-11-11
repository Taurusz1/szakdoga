// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "octokit";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const octokit = new Octokit({
  auth: publicRuntimeConfig.GIT_ACCESS_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await octokit.rest.repos.listReleases({
    mediaType: {
      format: "raw",
    },
    owner: req.body.owner,
    repo: req.body.repo,
  });
  res.status(200).json(result.data);
}
