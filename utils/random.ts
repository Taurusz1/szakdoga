import sbom from "@/models/sbom";
import { downloadCSV } from "./csv";
import { DownloadSBOMsFromMongoDB } from "./mongoDBQueries";

export const FullCSV = async () => {
  const sbomArray: sbom[] = await DownloadSBOMsFromMongoDB();
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
