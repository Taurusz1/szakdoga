// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "octokit";
import getConfig from "next/config";
import connectDB from "@/utils/db";

const { publicRuntimeConfig } = getConfig();

const octokit = new Octokit({
  auth: publicRuntimeConfig.GIT_ACCESS_TOKEN,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  if (req.method === "POST") {
    const data = await octokit.rest.securityAdvisories.listRepositoryAdvisories(
      {
        owner: req.body[0],
        repo: req.body[1],
        //owner: "artifacthub",
        //repo: "hub",
      }
    );
    res.status(200).json(data);
  }
}
