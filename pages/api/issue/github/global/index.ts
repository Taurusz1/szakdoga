// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "octokit";
import getConfig from "next/config";
import SecurityAdvisory from "@/models/vuln";

const { publicRuntimeConfig } = getConfig();

const octokit = new Octokit({
  auth: publicRuntimeConfig.GIT_ACCESS_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const ghsaIDs: string = req.body.ghsaID;
    const result = await octokit.rest.securityAdvisories.listGlobalAdvisories({
      mediaType: {
        format: "raw",
      },
      ghsa_id: ghsaIDs,
    });
    res.status(200).json(result);
  }
}
