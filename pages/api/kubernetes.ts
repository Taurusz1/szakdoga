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
  const result = await octokit.rest.dependencyGraph.exportSbom({
    mediaType: {
      format: "raw",
    },
    owner: "kubernetes",
    repo: "Kubernetes",
  });
  const packageNames = result.data.sbom.packages.map((p)=>{return p.name;});
  console.log(packageNames);
  const sortedPackageNames = packageNames.sort();
  console.log(sortedPackageNames);

  res.status(200).json({name: "Jhon"});
}