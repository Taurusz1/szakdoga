import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import getConfig from "next/config";
import sbom from "@/models/sbom";
import { FormatSBOMName } from "@/utils/Formating";

import {
  KubernetesTier1Vulns,
  SBOMSInstanceCountToCSV,
  SBOMSWithPackageNameCSV,
} from "@/utils/csv/csv";
import SecurityAdvisory from "@/models/vuln";
import { useState } from "react";
import { DownloadVulnFromGithub } from "@/utils/github";
import {
  GetSBOMFromMongoDB,
  GetSBOMsFromMongoDB,
  SetSBOMToMongoDB,
  UpdateSBOMToMongoDB,
  SetVulnToMongoDB,
} from "@/utils/mongoDBQueries";

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

  async function InsertInstanceNumberIntoSBOM() {
    const sbomArray: sbom[] = await GetSBOMsFromMongoDB();
    const numberArray = [
      1, 12, 18, 22, 22, 93, 59, 79, 88, 23, 20, 7, 5, 16, 99, 146, 48, 18, 21,
      4, 13, 22, 20, 18, 1, 9, 5, 72, 22, 22, 22, 73, 22, 23, 22, 21, 22, 12,
      153, 1, 188, 14, 22, 23, 11, 23, 15, 14, 39, 46, 25, 1, 29, 43, 75, 78,
      20, 43, 24, 574, 3, 23, 15, 7, 91, 95, 99, 22, 35, 6, 97, 14, 8, 203, 29,
      66, 20, 145, 12, 22, 23, 31, 207, 111, 17, 129, 120, 131, 25, 26, 29, 24,
      24, 30, 25, 24, 55, 40, 58, 72, 223, 139, 194, 62, 433, 23, 24, 45, 8, 17,
      36, 433, 1, 115, 59, 49, 304, 89, 105, 24, 67, 29, 30, 22, 22, 25, 43, 27,
      72, 181, 186, 126, 151, 36, 158, 175, 2, 22, 23, 24, 142, 195, 22, 18, 29,
      25, 22, 153, 136, 22, 22, 23, 22, 22, 21, 12, 24, 7, 20, 71, 153, 18, 23,
      251, 281, 146, 169, 22, 23, 26, 11, 182, 83, 201, 6, 36, 56, 61, 187, 189,
      22, 20, 22, 9, 93, 8, 23, 16, 23, 23, 16, 56, 91, 102, 112, 58, 35, 34,
      106, 22, 337, 486, 22, 18, 181, 177, 177, 175, 26, 24, 24, 22, 23, 126, 4,
      108, 24, 23, 22, 18, 20, 10, 23, 23, 239, 21, 20, 22, 19, 23, 23, 93, 104,
      187, 46, 62, 23, 20, 23, 81, 730, 58, 24, 17, 23, 23, 5, 23, 18, 13, 22,
      23, 23, 23, 23, 28, 30, 15, 12, 13, 27, 21, 22, 12, 55, 76, 54, 2, 71, 6,
      57, 57, 55, 40, 92, 57, 28, 1, 57, 168, 80, 3, 1, 44, 63, 87, 44, 57, 55,
      25, 12, 1, 2, 11, 10, 3, 7, 57, 40, 19, 8, 13, 1, 31, 26, 11, 44, 79, 87,
      43, 73, 23, 9, 48, 48, 33, 1, 5, 8, 9, 8, 8, 13, 2, 15, 31, 7, 95, 8, 24,
      62, 33, 4, 3, 9, 57, 55, 7, 5, 17, 2, 55, 12, 47, 8, 2, 2, 1, 11, 2, 1,
      41, 5, 20, 1, 19, 1, 2, 2, 1, 6, 1, 60, 60, 1, 10, 2, 132, 73, 68, 6, 30,
      4, 3, 4, 3, 2, 6, 11, 28, 6, 4, 5, 5, 6, 4, 4, 4, 1, 41, 34, 48, 35, 24,
      50, 32, 2, 2, 73, 28, 4, 4, 4, 3, 146, 106, 69, 2, 5, 133, 24, 13, 52, 28,
      1, 3, 115, 26, 114, 5, 3, 4, 35, 6, 48, 49, 29, 102, 4, 33, 20, 1, 1, 4,
      10, 13, 4, 2, 13, 14, 32, 31, 4, 43, 29, 1, 3, 8, 10, 1, 24, 2, 15, 15,
      20, 4, 22, 129, 19, 108, 5, 21, 21, 21, 22, 21, 1, 46, 106, 7, 10, 51, 1,
      4, 3, 4, 10, 10, 10, 2, 1, 6, 1, 29, 40, 85, 2, 20, 2, 9, 61, 3, 70, 36,
      77, 3, 1, 15, 8, 76, 2, 5, 6, 6, 5, 76, 110, 26, 76, 24, 73, 69, 102, 31,
      12, 23, 2, 3, 4, 7, 2, 42, 30, 25, 9, 9, 23, 4, 12, 6, 10, 17, 6, 6, 32,
      3, 1, 10, 6, 1, 12, 5, 7, 23, 19, 15, 33, 19, 14, 2, 1, 1, 51, 28, 28, 30,
      8, 23, 11, 69, 1, 1, 13, 120, 18, 17, 24, 21, 21, 1, 16, 16, 17, 2, 1, 4,
      2, 15, 17, 1, 10, 84, 7, 4, 6, 1, 1, 10, 15, 1, 1, 13, 3, 1, 1, 53, 3, 12,
      5, 5, 21, 16, 10, 28, 5, 71, 25, 11, 12, 8, 4, 3, 8, 6, 6, 2, 5, 5, 6, 24,
      3, 3, 2, 1, 2, 8, 3, 22, 8, 4, 27, 2, 36, 2, 15, 17, 3, 26, 2, 1, 1, 14,
      2, 4, 3, 31, 22, 5, 2, 3, 8, 10, 5, 8, 2, 8, 22, 4, 1, 1, 1, 22, 2, 1, 61,
      5, 10, 1, 7, 2, 4, 3, 8, 6, 2, 1, 1, 3, 3, 13, 7, 14, 16, 1, 7, 5, 19, 2,
      2, 2, 2, 4, 7, 7, 4, 17, 2, 1, 9, 1, 29, 28, 13, 5, 3, 1, 3, 3, 6, 6, 6,
      4, 3, 7, 4, 4, 5, 9, 19, 6, 10, 5, 3, 3, 10, 6, 9, 10, 16, 11, 5, 6, 1, 2,
      17, 3, 5, 6, 4, 3, 6, 2, 30, 1, 26, 5, 64, 68, 10, 3, 6, 4, 28, 5, 3, 2,
      2, 2, 6, 29, 2, 2, 65, 3, 21, 5, 5, 2, 14, 6, 29, 7, 5, 4, 1, 1, 19, 14,
      19, 4, 19, 24, 6, 2, 2, 2, 2, 17, 18, 18, 18, 15, 19, 1, 14, 4, 2, 3, 7,
      1, 4, 2, 2, 3, 2, 2, 34, 16, 22, 22, 28, 39, 21, 16, 13, 12, 3, 6, 16, 15,
      7, 3, 10, 11, 2, 8, 2, 3, 3, 2, 15, 14, 2, 4, 6, 2, 2, 2, 5, 3, 2, 11, 3,
      4, 12, 2, 2, 60, 2, 12, 20, 42, 45, 2, 3, 18, 4, 2, 9, 12, 5, 4, 40, 3, 7,
      7, 11, 6, 2, 1, 5, 7, 2, 1, 1, 53, 46, 5, 6, 4, 6, 2, 9, 3, 1, 11, 1, 1,
      37, 1, 31, 1, 31, 1, 5, 1, 1, 4, 1, 1, 8, 3, 1, 3, 1, 6, 2, 3, 3, 4, 2,
      11, 71, 7, 6, 1, 5, 7, 4, 11, 5, 1, 12, 1, 1, 3, 26, 2, 3, 4, 72, 2, 5, 1,
      3, 5, 10, 5, 5, 11, 3, 6, 1, 2, 4, 77, 4, 5, 4, 8, 32, 12, 86, 31, 6, 1,
      17, 33, 2, 6, 5, 5, 10, 2, 2, 2, 1, 1, 6, 11, 13, 2, 8, 4, 3, 3, 3, 13, 6,
      2, 2, 2, 2, 18, 8, 15, 21, 3, 1, 2, 2, 16, 4, 3, 2, 3, 5, 1, 4, 3, 18, 17,
      3, 1, 1, 1, 2, 18, 2, 6, 2, 2, 2, 1, 1, 1, 1, 1, 11, 4, 3, 1, 17, 19, 10,
      3, 1, 1, 2, 1, 1, 1, 13, 20, 1, 1, 7, 5, 1, 2, 1, 1, 9, 1, 1, 1, 1, 2, 1,
      1, 2, 2, 6, 1, 15, 7, 1, 13, 10, 1, 15, 6, 1, 1, 1, 2, 22, 21, 24, 2, 21,
      23, 25, 3, 1, 2, 1, 1, 3, 1, 3, 1, 1, 9, 7, 1, 2, 2, 4, 14, 1, 1, 6, 1, 1,
      1, 2, 2, 6, 6, 2, 2, 5, 2, 1, 1, 2, 1, 4, 1, 3, 1, 1, 2, 2, 3, 2, 23, 3,
      3, 3, 4, 8, 2, 1, 2, 2, 2, 10, 4, 3, 1, 1, 1, 2, 2, 4, 3, 1, 1, 2, 25, 6,
      2, 1, 3, 3, 2, 2, 3, 1, 1, 2, 2, 10, 4, 5, 6, 1, 25, 2, 1, 2, 1, 1, 3, 13,
      2, 15, 1, 6, 2, 21, 3, 4, 3, 3, 3, 6, 5, 1, 3, 1, 1, 2, 2, 2, 3, 2, 2, 5,
      12, 17, 6, 3, 2, 9, 3, 2, 6, 2, 7, 24, 8, 4, 1, 27, 1, 6, 1, 7, 3, 3, 4,
      3, 4, 2, 6, 23, 17, 3, 22, 1, 23, 28, 3, 4, 2, 2, 4, 1, 2, 2, 13, 3, 1, 5,
      1, 22, 3, 22, 4, 3, 6, 2, 2, 1, 1, 17, 3, 20, 1, 1, 1, 1, 1, 1, 8, 1, 4,
      2, 1, 3, 1, 27, 10, 9, 15, 7, 3, 17, 2, 4, 2, 5, 2, 1, 17, 4, 5, 5, 1, 11,
      5, 4, 12, 12, 2, 8, 10, 1, 10, 5, 2, 8, 2, 4, 3, 2, 1, 3, 5, 1, 1, 1, 1,
      2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2,
      1, 6, 1, 10, 4, 4, 3, 5, 3, 2, 3, 1, 11, 11, 4, 10, 23, 5, 1, 9, 1, 4, 3,
      8, 5, 2, 13, 14, 1, 11, 8, 1, 1, 10, 5, 1, 1, 1, 10, 1, 1, 2, 1, 2, 1, 2,
      3, 10, 33, 5, 10, 2, 2, 3, 4, 3, 10, 8, 3, 7, 3, 3, 1, 2, 6, 2, 1, 8, 7,
      6, 7, 10, 8, 4, 6, 9, 7, 9, 8, 10, 7, 6, 11, 11, 1, 1, 1, 1, 2, 1, 1, 9,
      7, 11, 6, 2, 1, 14, 2, 5, 1, 1, 1, 1, 1, 1, 3, 3, 6, 1, 2, 4, 2, 7, 3, 1,
      5, 2, 5, 2, 4, 4, 1, 7, 3, 4, 5, 5, 4, 2, 7, 6, 2, 15, 1, 6, 3, 3, 1, 2,
      4, 1, 1, 4, 1, 2, 5, 1, 6, 24, 1, 2, 2, 1, 3, 2, 8, 3, 4, 4, 6, 5, 2, 1,
      21, 21, 8, 1, 1, 1, 3, 2, 18, 4, 7, 10, 4, 4, 2, 2, 2, 4, 7, 20, 20, 3, 4,
      4, 3, 4, 2, 4, 4, 2, 3, 8, 4, 5, 3, 2, 5, 4, 1, 1, 3, 1, 1, 4, 3, 2, 2, 3,
      2, 11, 9, 6, 3, 4, 2, 1, 1, 8, 6, 26, 9, 3, 2, 4, 1, 1, 1, 4, 5, 2, 2, 1,
      1, 1, 1, 1, 1, 1, 5, 1, 4, 2, 3, 1, 4, 3, 3, 3, 4, 1, 2, 2, 1, 3, 1, 5, 3,
      2, 1, 2, 1, 1, 4, 3, 1, 2, 4, 4, 1, 1, 2, 3, 2, 7, 3, 2, 2, 1, 2, 1, 1,
      21, 21, 3, 3, 1, 3, 3, 4, 9, 3, 1, 1, 1, 1, 4, 3, 1, 1, 1, 3, 1, 1, 1, 1,
      4, 3, 1, 7, 2, 1, 2, 4, 2, 7, 1, 1, 3, 2, 3, 3, 1, 4, 3, 1, 2, 1, 3, 2, 2,
      2, 1, 6, 1, 2, 2, 2, 4, 3, 9, 3, 2, 1, 4, 1, 1, 1, 2, 1, 2, 2, 1, 3, 5, 1,
      2, 6, 6, 2, 2, 2, 3, 2, 5, 1, 2, 1, 3, 13, 3, 4, 5, 23, 26, 28, 30, 12, 3,
      10, 27, 28, 6, 26, 9, 4, 26, 29, 3, 9, 10, 9, 8, 7, 4, 2, 2, 2, 2, 1, 2,
      1, 2, 8, 1, 2, 2, 2, 3, 3, 1, 4, 2, 2, 3, 2, 5, 1, 3, 1, 1, 2, 2, 2, 3, 1,
      4, 2, 1, 1, 1, 1, 6, 2, 6, 1, 2, 3, 1, 2, 1, 1, 2, 1, 1, 4, 1, 5, 1, 1, 1,
      1, 3, 3, 1, 3, 1, 2, 1, 1, 3, 1, 2, 2, 8, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1,
      3, 2, 3, 4, 7, 1, 1, 1, 2, 5, 2, 3, 9, 1, 6, 1, 1, 2, 2, 1, 2, 1, 2, 2, 2,
      4, 2, 2, 2, 1, 3, 3, 4, 2, 1, 5, 3, 1, 1, 2, 1, 2, 1, 1, 4, 3, 3, 3, 1, 5,
      3, 5, 15, 5, 1, 2, 4, 3, 1, 1, 1, 2, 1, 1, 2, 3, 1, 2, 1, 2, 1, 1, 1, 1,
      1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 3, 3, 4, 2, 2, 2, 1, 1, 3, 4, 4, 1, 4, 2, 2,
      2, 2, 3, 3, 4, 3, 1, 3, 5, 2, 3, 2, 1, 2, 1, 1, 1, 1, 2, 3, 22, 2, 1, 1,
      1, 2, 2, 3, 1, 6, 2, 4, 3, 2, 2, 2, 7, 3, 1, 2, 2, 1, 1, 1, 1, 1, 3, 1, 1,
      1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 2, 1, 1, 1,
      1, 2, 2, 1, 1, 4, 2, 1, 5, 1, 2, 1, 1, 3, 1, 1, 5, 1, 1, 1, 1, 2, 1, 1, 3,
      2, 2, 3, 2, 1, 1, 1, 5, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 1, 1, 5, 4, 1, 2,
      1, 2, 2, 1, 14, 15, 13, 15, 14, 14, 15, 5, 2, 4, 4, 2, 2, 3, 3, 2, 4, 3,
      3, 1, 1, 3, 5, 5, 2, 4, 3, 3, 1, 3, 3, 1, 1, 1, 2, 1, 1, 5, 3, 4, 1, 5, 1,
      2, 1, 2, 2, 1, 1, 5, 5, 6, 7, 2, 1, 1, 5, 2, 2, 5, 1, 1, 9, 1, 1, 3, 1, 3,
      2, 2, 1, 1, 1, 1, 2, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2,
      2, 2, 1, 1, 1, 1, 2, 4, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 2, 3, 2, 2, 3,
      4, 5, 3, 2, 2, 3, 3, 3, 3, 2, 6, 4, 5, 4, 3, 2, 2, 1, 1, 1, 1, 1, 3, 1, 1,
      1, 1, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 3, 2, 2, 2, 1,
      1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 3, 6, 1, 1, 1, 1,
      1, 2, 2, 1, 2, 1, 1, 1, 6, 1, 3, 1, 1, 4, 1, 6, 1, 1, 1, 3, 2, 1, 1, 1, 3,
      1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 4, 3, 1, 1, 1, 1, 1, 1, 1,
      2, 2, 1, 4, 2, 2, 1, 1, 4, 1, 1, 2, 5, 7, 3, 2, 3, 3, 2, 6, 3, 3, 3, 4, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3, 2, 1, 1, 1, 5, 5, 4, 2, 3,
      4, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 1, 3, 3, 4, 1, 1, 3, 1, 4, 2, 4,
      4, 2, 1, 2, 4, 3, 2, 2, 2, 2, 3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4,
      3, 1, 2, 1,
    ];
    for (let i = 0; i < sbomArray.length; i++) {
      sbomArray[i].instanceCount = numberArray[i];
      await UpdateSBOMToMongoDB(sbomArray[i]);
    }
  }

  async function TransferSBOMList() {
    const sboms: sbom[] = await GetSBOMsFromMongoDB();
    for (let i = 0; i < sboms.length; i++) {
      await SetSBOMToMongoDB(sboms[i]);
    }
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
        <button onClick={SBOMSWithPackageNameCSV}>LightSBOM CSV</button>
        <button onClick={SBOMSInstanceCountToCSV}>
          SBOMSWithoutPackageNameCSV
        </button>
        <button onClick={InsertInstanceNumberIntoSBOM}>
          Insert Instance Number IntoSBOM
        </button>
        <button onClick={TransferSBOMList}>Transfer SBOM List</button>
      </main>
    </>
  );
}
