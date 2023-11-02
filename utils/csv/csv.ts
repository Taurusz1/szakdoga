import sbom from "@/models/sbom";
import {
  GetSBOMFromMongoDB,
  GetSBOMFromMongoDBByName,
  GetSBOMsFromMongoDB,
  GetVulns,
} from "../mongoDBQueries";
import * as Papa from "papaparse";
import SecurityAdvisory from "@/models/vuln";
import {
  FilterSbom,
  FormatSBOMName,
  FormatSBOMPackageName,
} from "../Formating";
import { DownloadVulnFromGithub } from "../github";

export const SBOMSWithPackageNameCSV = async () => {
  const sbomArray: sbom[] = await GetSBOMsFromMongoDB();
  SBOMsToLightCsv(sbomArray);
};

export const SBOMSInstanceCountToCSV = async () => {
  const sbomArray: sbom[] = await GetSBOMsFromMongoDB();
  const OGSBOMS = FindOGSBOMs(sbomArray);
  const dataSbomCount: { [key: string]: number } = {};
  const overallSbomCount: { [key: string]: number } = {};
  let alreadyVisitedNodes: string[][] = [];

  sbomArray.forEach((sbom) => {
    const sbomName = sbom.name;
    dataSbomCount[sbomName] = (dataSbomCount[sbomName] || 0) + 1;
  });

  for (let i = 0; i < OGSBOMS.length; i++) {
    if (i > 0) {
      console.log("DOING", OGSBOMS[i].name, "Index: ", i);
      alreadyVisitedNodes = [];
      const instanceCount = dataSbomCount[OGSBOMS[i].name];
      DFS(
        OGSBOMS[i],
        OGSBOMS,
        instanceCount,
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

  const data = OGSBOMS.map((sbom) => [
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

function DFS(
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

async function DFS2(
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

async function DFS3(
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

const isAlreadyVisited = (sbomName: string, visited: string[][]) => {
  const name = FormatSBOMName(sbomName);
  for (let i = 0; i < visited.length; i++) {
    if (name[0] === visited[i][0] && name[1] === visited[i][1]) {
      return true;
    }
  }
  return false;
};

function FormatToSBOMName(importString: string) {
  const parts = importString.split("/");
  const owner = parts[1];
  const repo = parts[2];
  const com = parts[0].split(".")[1];
  const github = parts[0].split(":")[1].split(".")[0];
  const result = `${com}.${github}.${owner}/${repo}`;
  return result;
}

export const FullVulnCSV = async () => {
  const vulnArray: SecurityAdvisory[] = await GetVulns();
  convertVulnsToCsv(vulnArray);
};

export async function KubernetesTier1Vulns() {
  const formattedName = ["kubernetes", "kubernetes"];
  const vulns: SecurityAdvisory[] = await DownloadVulnFromGithub(formattedName);
  convertVulnsToCsv(vulns);
}

export async function KubernetesTier2Vulns() {
  const formattedName = ["kubernetes", "kubernetes"];
  const vulns: SecurityAdvisory[] = await DownloadVulnFromGithub(formattedName);
  convertVulnsToCsv(vulns);
}

function SBOMsToLightCsv(instances: sbom[]) {
  const properties: (keyof sbom)[] = ["creationInfo", "name"];
  const csvData: string[][] = [];
  instances.forEach((instance, instanceIndex) => {
    const flatInstance: { [key: string]: any } = {};
    properties.forEach((property) => {
      if (property === "creationInfo") {
        flatInstance["created"] = instance.creationInfo.created;
      } else {
        flatInstance[property] = instance[property];
      }
    });
    instance.packages.forEach((pkg, index) => {
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

function convertVulnsToCsv(instances: SecurityAdvisory[]) {
  const properties: (keyof SecurityAdvisory)[] = [
    "ghsa_id",
    "cve_id",
    "html_url",
    "summary",
    "description",
    "severity",
    "publisher",
    "updated_at",
    "published_at",
    "cvss",
    "cwe_ids",
    "vulnerabilities",
  ];
  const csvData: string[][] = [];
  instances.forEach((instance, instanceIndex) => {
    const flatInstance: { [key: string]: any } = {};
    properties.forEach((property) => {
      if (property === "publisher") {
        if (instance.publisher) {
          flatInstance["publisher_url"] = instance.publisher.html_url;
        }
      } else if (property === "vulnerabilities") {
        instance.vulnerabilities?.forEach((vulnerability, index) => {
          flatInstance[`vulnerability_${index}_ecosystem`] =
            vulnerability.package?.ecosystem || "";
          flatInstance[`vulnerability_${index}_name`] =
            vulnerability.package?.name || "";
          flatInstance[`vulnerability_${index}_vulnerable_version_range`] =
            vulnerability.vulnerable_version_range || "";
          flatInstance[`vulnerability_${index}_patched_versions`] =
            vulnerability.patched_versions || "";
        });
      } else if (property === "cvss") {
        flatInstance[`cvss_vector_string`] = instance.cvss?.vector_string || "";
        flatInstance[`cvss_score`] = instance.cvss?.score || "";
      } else {
        flatInstance[property] = instance[property] || "";
      }
    });
    const rowData = Object.keys(flatInstance).map((key) => flatInstance[key]);
    if (instanceIndex === 0) {
      csvData.push(Object.keys(flatInstance));
    }
    csvData.push(rowData);
  });
  downloadCSV(csvData);
}

export const downloadCSV = (csvData: any) => {
  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "VulnTest";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
