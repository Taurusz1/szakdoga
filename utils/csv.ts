import sbom from "@/models/sbom";
import { DownloadSBOMsFromMongoDB, GetVulns } from "./mongoDBQueries";
import * as Papa from "papaparse";
import SecurityAdvisory from "@/models/vuln";

export const FullCSV = async () => {
  const sbomArray: sbom[] = await DownloadSBOMsFromMongoDB();
  convertFullInstanceToCsv(sbomArray);
};

export const SBOMSWithPackageNameCSV = async () => {
  const sbomArray: sbom[] = await DownloadSBOMsFromMongoDB();
  convertLigthInstanceToCsv(sbomArray);
};

export const SBOMSWithoutPackageNameCSV = async () => {
  const sbomArray: sbom[] = await DownloadSBOMsFromMongoDB();
  const LightSBOMArray: sbom[] = [];

  for (let i = 0; i < sbomArray.length; i++) {
    if (!isIncluded(sbomArray[i], LightSBOMArray)) {
      LightSBOMArray.push(sbomArray[i]);
    }
  }
  const sbomCount: { [key: string]: number } = {};

  sbomArray.forEach((sbom) => {
    const sbomName = sbom.name; // Get the name property as the key
    sbomCount[sbomName] = (sbomCount[sbomName] || 0) + 1;
  });

  const header = [
    "created",
    "name",
    "parantName",
    "documentDescribes",
    "documentNamespace",
    "instanceCount",
  ];

  const data = LightSBOMArray.map((sbom) => [
    sbom.creationInfo.created,
    sbom.name,
    sbom.parentSBOMName?.join(";"),
    sbom.documentDescribes.join(";"),
    sbom.documentNamespace,
    sbomCount[sbom.name],
  ]);

  const csvData = [header, ...data];
  downloadCSV(csvData);
};

function isIncluded(newItem: sbom, smallList: sbom[]) {
  for (let i = 0; i < smallList.length; i++) {
    if (smallList[i].name == newItem.name) {
      return true;
    }
  }
  return false;
}

export const FullVulnCSV = async () => {
  const vulnArray: SecurityAdvisory[] = await GetVulns();
  convertSecurityAdvisoryToCsv(vulnArray);
};

function convertFullInstanceToCsv(instances: sbom[]) {
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

function convertLigthInstanceToCsv(instances: sbom[]) {
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

function convertSecurityAdvisoryToCsvOld(instances: SecurityAdvisory[]) {
  const properties: (keyof SecurityAdvisory)[] = [
    "ghsa_id",
    "cve_id",
    //"url",
    "html_url",
    "summary",
    "description",
    "severity",
    //"author",
    "publisher",
    "identifiers",
    "state",
    //"created_at",
    "updated_at",
    "published_at",
    "closed_at",
    "withdrawn_at",
    "submission",
    "cvss",
    //"cwes",
    "cwe_ids",
    //"credits",
    //"credits_detailed",
    //"collaborating_users",
    //"collaborating_teams",
    //"private_fork",
    "vulnerabilities",
  ];
  const csvData: string[][] = [];
  instances.forEach((instance, instanceIndex) => {
    const flatInstance: { [key: string]: any } = {};
    properties.forEach((property) => {
      if (property === "publisher") {
        // Handle 'publisher' separately
        if (instance.publisher) {
          flatInstance["publisher_url"] = instance.publisher.html_url;
          /*flatInstance["publisher_id"] = instance.publisher.id || "";
          flatInstance["publisher_type"] = instance.publisher.type || "";
          flatInstance["publisher_site_admin"] = instance.publisher.site_admin
            ? "Yes"
            : "No";*/
        }
      } else if (property === "identifiers") {
        /* Handle 'identifiers' separately
        instance.identifiers?.forEach((identifier, index) => {
        flatInstance[`identifier_${index}_value`] = identifier.value || "";
        flatInstance[`identifier_${index}_type`] = identifier.type || "";
        });*/
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
          //flatInstance[`vulnerability_${index}_vulnerable_functions`] =
          //  vulnerability.vulnerable_functions!.join(";");
        });
      } else if (property === "cvss") {
        flatInstance[`cvss_vector_string`] = instance.cvss?.vector_string || "";
        flatInstance[`cvss_score`] = instance.cvss?.score || "";
      } /*else if (property === "cwes") {
      instance.cwes?.forEach((cwe, index) => {
        flatInstance[`cwe_${index}_cwe_id`] = cwe.cwe_id || "";
        flatInstance[`cwe_${index}_name`] = cwe.name || "";
      });
      } else if (property === "credits_detailed") {
         Handle 'credits_detailed' separately
        instance.credits_detailed?.forEach((creditDetail, index) => {
          flatInstance[`creditDetail_${index}_login`] =
            creditDetail.user?.login || "";
          flatInstance[`creditDetail_${index}_type`] = creditDetail.type || "";
          flatInstance[`creditDetail_${index}_state`] =
            creditDetail.state || "";
        });
      } */ else {
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

function convertSecurityAdvisoryToCsv(instances: SecurityAdvisory[]) {
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

const downloadCSV = (csvData: any) => {
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
