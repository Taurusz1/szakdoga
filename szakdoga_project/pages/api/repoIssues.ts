// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Octokit } from "octokit";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();


const octokit = new Octokit({
    auth: publicRuntimeConfig.GIT_ACCESS_TOKEN
  });

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const result = await octokit.request(`GET /repos/{owner}/{repo}/issues`, {
    owner: publicRuntimeConfig.GIT_USER,
    repo: publicRuntimeConfig.GIT_REPO,
  });
  console.log(result);
  res.status(200).json({ name: 'John Doe' })
}
