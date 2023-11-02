import sbom from "@/models/sbom";
import { GetSBOMsFromMongoDB } from "../mongoDBQueries";
import { FormatSBOMName } from "../Formating";
import { DFS2 } from "./DFS";
import { downloadCSV } from "./DownloadCSV";

export const SBOMSInstanceCountToCSV = async () => {
  const sbomArray: sbom[] = await GetSBOMsFromMongoDB();
  const overallSbomCount: { [key: string]: number } = {};
  let alreadyVisitedNodes: string[][] = [];

  for (let i = 0; i < sbomArray.length; i++) {
    if (sbomArray[i].name != "com.github.kubernetes/kubernetes") {
      console.log("DOING", sbomArray[i].name, "Index: ", i);
      alreadyVisitedNodes = [];
      DFS2(
        sbomArray[i],
        sbomArray[i].instanceCount!,
        overallSbomCount,
        alreadyVisitedNodes
      );
    }
  }

  const header = [
    "created",
    "name",
    "parantName",
    "documentDescribes",
    "documentNamespace",
    "instanceCount",
  ];

  const data = sbomArray.map((sbom) => [
    sbom.creationInfo.created,
    sbom.name,
    sbom.parentSBOMName?.join(";"),
    sbom.documentDescribes.join(";"),
    sbom.documentNamespace,
    overallSbomCount[sbom.name],
  ]);

  const csvData = [header, ...data];
  downloadCSV(csvData);
};

export async function SBOMsToLightCsv() {
  const sbomArray: sbom[] = await GetSBOMsFromMongoDB();
  const properties: (keyof sbom)[] = ["creationInfo", "name"];
  const csvData: string[][] = [];
  sbomArray.forEach((sbomArray, instanceIndex) => {
    const flatInstance: { [key: string]: any } = {};
    properties.forEach((property) => {
      if (property === "creationInfo") {
        flatInstance["created"] = sbomArray.creationInfo.created;
      } else {
        flatInstance[property] = sbomArray[property];
      }
    });
    sbomArray.packages.forEach((pkg, index) => {
      const prefix = `package_${index + 1}_`;
      flatInstance[`${prefix}name`] = pkg.name || "";
    });
    const rowData = Object.keys(flatInstance).map((key) => flatInstance[key]);
    if (instanceIndex === 0) {
      csvData.push(Object.keys(flatInstance));
    }
    csvData.push(rowData);
  });
  downloadCSV(csvData);
}

export const isAlreadyVisited = (sbomName: string, visited: string[][]) => {
  const name = FormatSBOMName(sbomName);
  for (let i = 0; i < visited.length; i++) {
    if (name[0] === visited[i][0] && name[1] === visited[i][1]) {
      return true;
    }
  }
  return false;
};

function FindOGSBOMs(sbomArray: sbom[]) {
  const OGSBOMSet = new Set();
  const OGSBOMArray: sbom[] = [];
  for (let i = 0; i < sbomArray.length; i++) {
    if (!OGSBOMSet.has(sbomArray[i].name)) {
      OGSBOMSet.add(sbomArray[i].name);
      OGSBOMArray.push(sbomArray[i]);
    }
  }
  return OGSBOMArray;
}
