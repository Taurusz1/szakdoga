import sbom from "@/models/sbom";
import { DownloadSBOMsFromMongoDB } from "./mongoDBQueries";
import * as Papa from "papaparse";

export const FullCSV = async () => {
  const sbomArray: sbom[] = await DownloadSBOMsFromMongoDB();
  const header = [
    "SPDXID",
    "spdxVersion",
    "created",
    "creators",
    "parantName",
    "name",
    "dataLicense",
    "documentDescribes",
    "documentNamespace",
    "packages",
  ];

  const data = sbomArray.map((sbom) => [
    sbom.SPDXID,
    sbom.spdxVersion,
    sbom.creationInfo.created,
    sbom.creationInfo.creators.join(";"),
    sbom.parentSBOMName?.join(";"),
    sbom.name,
    sbom.dataLicense,
    sbom.documentDescribes.join(";"),
    sbom.documentNamespace,
    JSON.stringify(sbom.packages),
  ]);

  const csvData = [header, ...data];
  downloadCSV(csvData);
};

export const SBOMSWithPackageNameCSV = async () => {
  const sbomArray: sbom[] = await DownloadSBOMsFromMongoDB();
  const header = [
    "created",
    "name",
    "parantName",
    "documentDescribes",
    "documentNamespace",
    "packages",
  ];

  const data = sbomArray.map((sbom) => [
    sbom.creationInfo.created,
    sbom.name,
    sbom.parentSBOMName?.join(";"),
    sbom.documentDescribes.join(";"),
    sbom.documentNamespace,
    JSON.stringify(sbom.packages),
  ]);

  const csvData = [header, ...data];
  downloadCSV(csvData);
};

export const SBOMSWithoutPackageNameCSV = async () => {
  const sbomArray: sbom[] = await DownloadSBOMsFromMongoDB();
  const header = [
    "created",
    "name",
    "parantName",
    "documentDescribes",
    "documentNamespace",
  ];

  const data = sbomArray.map((sbom) => [
    sbom.creationInfo.created,
    sbom.name,
    sbom.parentSBOMName?.join(";"),
    sbom.documentDescribes.join(";"),
    sbom.documentNamespace,
  ]);

  const csvData = [header, ...data];
  downloadCSV(csvData);
};

const downloadCSV = (csvData: any) => {
  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "test";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
