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
  //Amennyiszer egy csomag megjelenik, annyit kell hozzáadni a leszármazottaihoz is
  if (!isAlreadyVisited(sbom.name, alreadyVisitedNodes)) {
    alreadyVisitedNodes.push(FormatSBOMName(sbom.name));

    overallSbomCount[sbom.name] =
      (overallSbomCount[sbom.name] || 0) + instanceCount;

    if (sbom.packages) {
      for (let i = 1; i < sbom.packages.length; i++) {
        if (sbom.packages[i].name!.startsWith("go:github")) {
          //find the sbom corresponding to the dependency name
          const sbomName = FormatToSBOMName(sbom.packages[i].name!);
          const nextSbom = await GetSBOMFromMongoDBByName(sbomName);
          if (nextSbom) {
            await DFS2(
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
