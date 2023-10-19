import sbom from "@/models/sbom";
import { FormatSBOMName, FilterSbom } from "./Formating";
import { DownloadSBOMFromGithub } from "./github";
import {
  UploadSBOMToMongoDB,
  GetLength,
  DownloadSBOMFromMongoDB,
} from "./mongoDBQueries";

const packageNames: string[][] = [];

export const OnlyUniqueDependencyTree = async () => {
  const kubernetesSbom: sbom = await DownloadSBOMFromGithub(
    "kubernetes",
    "Kubernetes"
  );
  await UploadSBOMToMongoDB(kubernetesSbom);
  packageNames.push(["kubernetes", "kubernetes"]);
  let startIndex = 0;
  let sbomArrayLenght = 1;
  while (startIndex < sbomArrayLenght) {
    console.log(
      "StartingIndex:",
      startIndex,
      "SBOMArrayLength:",
      sbomArrayLenght
    );
    await MainLoopEveryPackageOnlyOnce(startIndex);
    if (startIndex + 5 > sbomArrayLenght) {
      sbomArrayLenght = await GetLength();
    }
    startIndex++;
  }
};

const MainLoopEveryPackageOnlyOnce = async (startIndex: number) => {
  const sbom = await DownloadSBOMFromMongoDB(startIndex);
  const parentName = FormatSBOMName(sbom.name);
  const uniquePackageNames = FilterSbom(sbom);
  console.log(
    "Number of Packages for:",
    sbom.name,
    ":",
    uniquePackageNames?.length
  );
  if (uniquePackageNames) {
    for (let i = 0; i < uniquePackageNames.length; i++) {
      if (!isAlreadyDonwloaded(uniquePackageNames[i])) {
        try {
          const newSbom = await DownloadSBOMFromGithub(
            uniquePackageNames[i][0],
            uniquePackageNames[i][1]
          );
          await UploadSBOMToMongoDB(newSbom, parentName);
          packageNames.push(uniquePackageNames[i]);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        console.log("Package Already Downloaded");
      }
    }
    console.log("SubSBOMS For ", sbom.name, " SBOM Downloaded");
  }
};

const isAlreadyDonwloaded = (newPackage: string[]) => {
  for (let i = 0; i < packageNames.length; i++) {
    if (
      newPackage[0] === packageNames[i][0] &&
      newPackage[1] === packageNames[i][1]
    ) {
      return true;
    }
  }
  return false;
};