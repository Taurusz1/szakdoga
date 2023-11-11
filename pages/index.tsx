import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import getConfig from "next/config";
import sbom from "@/models/sbom";
import { FormatSBOMName } from "@/utils/Formating";
import { RealsesToCSV, SBOMSInstanceCountToCSV } from "@/utils/csv/csv";
import SecurityAdvisory from "@/models/vuln";
import { useState } from "react";
import { DownloadVulnFromGithub } from "@/utils/github";
import { SetVulnToMongoDB } from "@/utils/mongoDBQueries";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { publicRuntimeConfig } = getConfig();
  const [sboms, setSboms] = useState<sbom[]>();

  const VulnsFromGithubToMongoDB = async () => {
    for (let i = 0; i < sboms!.length; i++) {
      const formattedName = FormatSBOMName(sboms![i].name);
      const vulns: SecurityAdvisory[] = await DownloadVulnFromGithub(
        formattedName
      );
      for (let i = 0; i < vulns.length; i++) {
        await SetVulnToMongoDB(vulns[i]);
      }
    }
  };

  async function Test() {
    const repoData = ["kubernetes", "kubernetes"];
    const res = await fetch(
      publicRuntimeConfig.API_ENDPOINT + "/issue/github/global",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(repoData),
      }
    );
    const resData = await res.json();
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <button onClick={SBOMSInstanceCountToCSV}>
          SBOMSWithoutPackageNameCSV
        </button>
        <button onClick={Test}>Test</button>
      </main>
    </>
  );
}
