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
  if (req.method === "POST") {
    const data = await octokit.rest.securityAdvisories.listGlobalAdvisories({
      mediaType: {
        format: "raw",
      },
      owner: req.body[0],
      repo: req.body[1],
    });
    res.status(200).json(data);
  }
}
