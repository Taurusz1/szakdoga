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
  const result = await octokit.rest.issues.listForRepo({
    mediaType: {
      format: "raw",
    },
    owner: publicRuntimeConfig.GIT_USER,
    repo: publicRuntimeConfig.GIT_REPO,
  });

  result.data.map((d) =>{console.log(d)});
  res.status(200).json({name: "Jhon"});
}