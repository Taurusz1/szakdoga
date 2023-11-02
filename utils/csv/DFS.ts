import sbom from "@/models/sbom";
import {
  FormatSBOMName,
  FormatSBOMPackageName,
  FormatToSBOMName,
} from "../Formating";
import { GetSBOMFromMongoDBByName } from "../mongoDBQueries";
import { isAlreadyVisited } from "./csv";

export function DFS(
  sbom: sbom,
  searchArray: sbom[],
  instanceCount: number,
  overallSbomCount: { [key: string]: number },
  alreadyVisitedNodes: string[][]
) {
  if (instanceCount <= 0) {
    return;
  }
  //Amennyiszer egy csomag megjelenik, annyit kell hozzáadni a leszármazottaihoz is
  if (!isAlreadyVisited(sbom.name, alreadyVisitedNodes)) {
    alreadyVisitedNodes.push(FormatSBOMName(sbom.name));
    overallSbomCount[sbom.name] =
      (overallSbomCount[sbom.name] || 0) + instanceCount;
    if (sbom.packages) {
      sbom.packages.forEach((sbomPackage, index) => {
        if (index > 0) {
          const sbomName = FormatSBOMPackageName(sbomPackage.name!);
          //find the sbom corresponding to the dependency name
          searchArray.forEach((nextSbom) => {
            const nextSbomName = FormatSBOMName(nextSbom.name);
            if (
              nextSbomName[0] == sbomName[0] &&
              nextSbomName[1] == sbomName[1]
            ) {
              DFS(
                nextSbom,
                searchArray,
                instanceCount,
                overallSbomCount,
                alreadyVisitedNodes
              );
            }
          });
        }
      });
    }
  } else {
    overallSbomCount[sbom.name] = (overallSbomCount[sbom.name] || 0) + 1;
  }
}

export async function DFS2(
  sbom: sbom,
  instanceCount: number,
  overallSbomCount: { [key: string]: number },
  alreadyVisitedNodes: string[][]
) {
  if (instanceCount <= 0) {
    return;
  }
  //Amennyiszer egy csomag megjelenik, annyit kell hozzáadni a leszármazottaihoz is
  if (!isAlreadyVisited(sbom.name, alreadyVisitedNodes)) {
    alreadyVisitedNodes.push(FormatSBOMName(sbom.name));

    overallSbomCount[sbom.name] =
      (overallSbomCount[sbom.name] || 0) + instanceCount;

    if (sbom.packages) {
      for (let i = 0; i < sbom.packages.length; i++) {
        if (i > 0 && sbom.packages[i].name!.startsWith("go:github")) {
          //find the sbom corresponding to the dependency name
          const sbomName = FormatToSBOMName(sbom.packages[i].name!);
          const nextSbom = await GetSBOMFromMongoDBByName(sbomName);
          if (nextSbom) {
            DFS2(
              nextSbom,
              instanceCount,
              overallSbomCount,
              alreadyVisitedNodes
            );
          }
        }
      }
    }
  }
}

export async function DFS3(
  sbom: sbom,
  instanceCount: number,
  overallSbomCount: { [key: string]: number },
  alreadyVisitedNodes: string[][]
) {
  if (instanceCount <= 0) {
    return;
  }

  if (!isAlreadyVisited(sbom.name, alreadyVisitedNodes)) {
    const currentSBOMName = FormatSBOMName(sbom.name);
    alreadyVisitedNodes.push(currentSBOMName);

    overallSbomCount[sbom.name] =
      (overallSbomCount[sbom.name] || 0) + instanceCount;

    if (sbom.packages) {
      const downloadPromises = [];

      for (let i = 0; i < sbom.packages.length; i++) {
        if (i > 0 && sbom.packages[i].name!.startsWith("go:github")) {
          const sbomName = FormatToSBOMName(sbom.packages[i].name!);

          // Check if the SBOM has already been downloaded
          if (!alreadyVisitedNodes.includes(currentSBOMName)) {
            downloadPromises.push(GetSBOMFromMongoDBByName(sbomName));
          }
        }
      }

      const downloadedSBOMs = await Promise.all(downloadPromises);

      for (const nextSbom of downloadedSBOMs) {
        if (nextSbom) {
          await DFS3(
            nextSbom,
            instanceCount,
            overallSbomCount,
            alreadyVisitedNodes
          );
        }
      }
    }
  }
}
