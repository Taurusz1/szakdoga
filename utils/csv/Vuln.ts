import SecurityAdvisory from "@/models/vuln";
import { DownloadVulnFromGithub } from "../github";
import { GetVulns } from "../mongoDBQueries";
import { downloadCSV } from "./DownloadCSV";

export const FullVulnCSV = async () => {
  const vulnArray: SecurityAdvisory[] = await GetVulns();
  VulnsToCsv(vulnArray);
};

export async function KubernetesTier1Vulns() {
  const formattedName = ["kubernetes", "kubernetes"];
  const vulns: SecurityAdvisory[] = await DownloadVulnFromGithub(formattedName);
  VulnsToCsv(vulns);
}

export async function KubernetesTier2Vulns() {
  const formattedName = ["kubernetes", "kubernetes"];
  const vulns: SecurityAdvisory[] = await DownloadVulnFromGithub(formattedName);
  VulnsToCsv(vulns);
}

function VulnsToCsv(instances: SecurityAdvisory[]) {
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
