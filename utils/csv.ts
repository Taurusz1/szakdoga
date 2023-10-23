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

export const FullVulnCSV = async () => {
  const vulnArray: SecurityAdvisory[] = await GetVulns();
  convertSecurityAdvisoryToCsv(vulnArray);
};

function convertFullInstanceToCsv(instances: sbom[]) {
  // Define the properties to include in the CSV
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
    // Create a flat object for CSV
    const flatInstance: { [key: string]: any } = {};

    properties.forEach((property) => {
      if (property === "creationInfo") {
        // Handle 'creationInfo' separately
        flatInstance["created"] = instance.creationInfo.created;
        flatInstance["creators"] = instance.creationInfo.creators.join(";");
      } else if (property === "documentDescribes") {
        // Handle 'documentDescribes' separately
        flatInstance["documentDescribes"] =
          instance.documentDescribes.join(";");
      } else {
        // For other properties, simply add them to the flat object
        flatInstance[property] = instance[property];
      }
    });

    // Handle the 'packages' array
    instance.packages.forEach((pkg, index) => {
      const prefix = `package_${index + 1}_`;
      flatInstance[`${prefix}name`] = pkg.name || "";
      flatInstance[`${prefix}versionInfo`] = pkg.versionInfo || "";
      flatInstance[`${prefix}downloadLocation`] = pkg.downloadLocation || "";
      flatInstance[`${prefix}filesAnalyzed`] = pkg.filesAnalyzed ? "Yes" : "No";
      flatInstance[`${prefix}supplier`] = pkg.supplier || "";
    });

    // Convert the flat object to an array
    const rowData = Object.keys(flatInstance).map((key) => flatInstance[key]);

    // Add the row data to the CSV data
    if (instanceIndex === 0) {
      // For the first instance, add the header
      csvData.push(Object.keys(flatInstance));
    }
    csvData.push(rowData);
  });
  downloadCSV(csvData);
}

function convertLigthInstanceToCsv(instances: sbom[]) {
  // Define the properties to include in the CSV
  const properties: (keyof sbom)[] = ["creationInfo", "name"];

  const csvData: string[][] = [];

  instances.forEach((instance, instanceIndex) => {
    // Create a flat object for CSV
    const flatInstance: { [key: string]: any } = {};

    properties.forEach((property) => {
      if (property === "creationInfo") {
        // Handle 'creationInfo' separately
        flatInstance["created"] = instance.creationInfo.created;
      } else {
        // For other properties, simply add them to the flat object
        flatInstance[property] = instance[property];
      }
    });

    // Handle the 'packages' array
    instance.packages.forEach((pkg, index) => {
      const prefix = `package_${index + 1}_`;
      flatInstance[`${prefix}name`] = pkg.name || "";
    });

    // Convert the flat object to an array
    const rowData = Object.keys(flatInstance).map((key) => flatInstance[key]);

    // Add the row data to the CSV data
    if (instanceIndex === 0) {
      // For the first instance, add the header
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
    "vulnerabilities",
    "cvss",
    "cwes",
    "cwe_ids",
    "credits",
    "credits_detailed",
    "collaborating_users",
    "collaborating_teams",
    "private_fork",
  ];
  const csvData: string[][] = [];
  instances.forEach((instance, instanceIndex) => {
    const flatInstance: { [key: string]: any } = {};
    properties.forEach((property) => {
      if (property === "publisher") {
        // Handle 'publisher' separately
        if (instance.publisher) {
          flatInstance["publisher_url"] = instance.publisher.html_url;
          //flatInstance["publisher_id"] = instance.publisher.id || "";
          //flatInstance["publisher_type"] = instance.publisher.type || "";
          //flatInstance["publisher_site_admin"] = instance.publisher.site_admin
          //  ? "Yes"
          //  : "No";
        }
      } else if (property === "identifiers") {
        // Handle 'identifiers' separately
        //instance.identifiers?.forEach((identifier, index) => {
        //flatInstance[`identifier_${index}_value`] = identifier.value || "";
        //flatInstance[`identifier_${index}_type`] = identifier.type || "";
        //});
      } else if (property === "vulnerabilities") {
        // Handle 'vulnerabilities' separately
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
      } else if (property === "cwes") {
        // Handle 'cwes' separately
        instance.cwes?.forEach((cwe, index) => {
          flatInstance[`cwe_${index}_cwe_id`] = cwe.cwe_id || "";
          flatInstance[`cwe_${index}_name`] = cwe.name || "";
        });
      } else if (property === "credits_detailed") {
        // Handle 'credits_detailed' separately
        instance.credits_detailed?.forEach((creditDetail, index) => {
          flatInstance[`creditDetail_${index}_login`] =
            creditDetail.user?.login || "";
          flatInstance[`creditDetail_${index}_type`] = creditDetail.type || "";
          flatInstance[`creditDetail_${index}_state`] =
            creditDetail.state || "";
        });
      } else {
        // For other properties, simply add them to the flat object
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
