import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import getConfig from "next/config";
import sbom from "@/models/sbom";
import { FilterSbom, FormatSBOMName } from "@/utils/Formating";
import {
  UploadSBOMToMongoDB,
  DownloadSBOMsFromMongoDB,
  GetLength,
  DownloadSBOMFromMongoDB,
} from "@/utils/mongoDBQueries";
import { DownloadSBOMFromGithub } from "@/utils/github";
import { FullDependencyTree } from "@/utils/FullDependencyTree";
import { DependencyTreeOnlyUnique } from "@/utils/DependencyTreeOnylUnique";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { publicRuntimeConfig } = getConfig();
  const ResetPackages = async () => {
    const sbom = await DownloadSBOMFromGithub("kubernetes", "Kubernetes");
    const uniquePackageNames = FilterSbom(sbom);
    const res = await fetch(
      publicRuntimeConfig.API_ENDPOINT + "/package/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uniquePackageNames),
      }
    );
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        DownLoadDependencyTree
        <button onClick={FullDependencyTree}>Full Dependency Tree </button>
        <button onClick={DependencyTreeOnlyUnique}>
          Dependency Tree Only Unique
        </button>
      </main>
    </>
  );
}
