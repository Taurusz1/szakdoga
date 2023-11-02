import sbom from "@/models/sbom";
import { downloadCSV } from "./csv/csv";
import { GetSBOMsFromMongoDB } from "./mongoDBQueries";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const FullCSV = async () => {
  const sbomArray: sbom[] = await GetSBOMsFromMongoDB();
  convertFullInstanceToCsv(sbomArray);
};

export function convertFullInstanceToCsv(instances: sbom[]) {
  const properties: (keyof sbom)[] = [
    "SPDXID",
    "spdxVersion",
    "creationInfo",
    "name",
    "dataLicense",
    "documentDescribes",
    "documentNamespace",
  ];
  const csvData: string[][] = [];
  instances.forEach((instance, instanceIndex) => {
    const flatInstance: { [key: string]: any } = {};
    properties.forEach((property) => {
      if (property === "creationInfo") {
        flatInstance["created"] = instance.creationInfo.created;
        flatInstance["creators"] = instance.creationInfo.creators.join(";");
      } else if (property === "documentDescribes") {
        flatInstance["documentDescribes"] =
          instance.documentDescribes.join(";");
      } else {
        flatInstance[property] = instance[property];
      }
    });
    instance.packages.forEach((pkg, index) => {
      const prefix = `package_${index + 1}_`;
      flatInstance[`${prefix}name`] = pkg.name || "";
      flatInstance[`${prefix}versionInfo`] = pkg.versionInfo || "";
      flatInstance[`${prefix}downloadLocation`] = pkg.downloadLocation || "";
      flatInstance[`${prefix}filesAnalyzed`] = pkg.filesAnalyzed ? "Yes" : "No";
      flatInstance[`${prefix}supplier`] = pkg.supplier || "";
    });
    const rowData = Object.keys(flatInstance).map((key) => flatInstance[key]);
    if (instanceIndex === 0) {
      csvData.push(Object.keys(flatInstance));
    }
    csvData.push(rowData);
  });
  downloadCSV(csvData);
}

export const UploadPackageNamesToMongoDB = async (packageNames: string[][]) => {
  const res = await fetch(
    publicRuntimeConfig.API_ENDPOINT + "/package/create",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(packageNames),
    }
  );
};

export const DownloadPackageNamesFromMongoDB = async () => {
  const res = await fetch(publicRuntimeConfig.API_ENDPOINT + "/package");
  const data = await res.json();
  return data;
};
