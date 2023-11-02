import sbom from "@/models/sbom";
import { FormatSBOMName, FilterSbom } from "../Formating";
import { DownloadSBOMFromGithub } from "../github";
import {
  SetSBOMToMongoDB,
  GetLength,
  GetSBOMFromMongoDB,
} from "../mongoDBQueries";

export const EverySBOMTree = async () => {
  const kubernetesSbom: sbom = await DownloadSBOMFromGithub(
    "kubernetes",
    "Kubernetes"
  );
  await SetSBOMToMongoDB(kubernetesSbom);
  let startIndex = 0;
  let sbomArrayLenght = 1;
  while (startIndex < sbomArrayLenght) {
    console.log(
      "StartingIndex:",
      startIndex,
      "SBOMArrayLength:",
      sbomArrayLenght
    );
    await MainLoopEvery(startIndex);
    if (startIndex + 5 > sbomArrayLenght) {
      sbomArrayLenght = await GetLength();
    }
    startIndex++;
  }
};

const MainLoopEvery = async (startIndex: number) => {
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
      try {
        const newSbom = await DownloadSBOMFromGithub(
          uniquePackageNames[i][0],
          uniquePackageNames[i][1]
        );
        await SetSBOMToMongoDB(newSbom, parentName);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    console.log("SubSBOMS For ", sbom.name, " SBOM Downloaded");
  }
};
