import sbom from "@/models/sbom";
import { FormatSBOMName, FilterSbom } from "../Formating";
import { DownloadSBOMFromGithub } from "../github";
import {
  SetSBOMToMongoDB,
  GetLength,
  GetSBOMFromMongoDB,
} from "../mongoDBQueries";
import { isAlreadyDonwloaded } from "./StubySBOMTree";

const packageNames: string[][] = [];

export const UniqueSBOMTree = async () => {
  const kubernetesSbom: sbom = await DownloadSBOMFromGithub(
    "kubernetes",
    "Kubernetes"
  );
  await SetSBOMToMongoDB(kubernetesSbom);
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
    await MainLoopUnique(startIndex);
    if (startIndex + 5 > sbomArrayLenght) {
      sbomArrayLenght = await GetLength();
    }
    startIndex++;
  }
};

const MainLoopUnique = async (startIndex: number) => {
  const sbom = await GetSBOMFromMongoDB(startIndex);
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
          await SetSBOMToMongoDB(newSbom, parentName);
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
