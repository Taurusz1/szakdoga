import { Release } from "@/models/release";
import { GetReleases } from "../github";
import { downloadCSV } from "./DownloadCSV";

export async function RealsesToCSV() {
  const realses: Release[] = await GetReleases(["evanphx", "json-patch"]);

  const properties: (keyof Release)[] = [
    "html_url",
    "id",
    "node_id",
    "tag_name",
    "name",
    "draft",
    "prerelease",
    "created_at",
    "published_at",
  ];

  const csvData: string[][] = [];

  realses.forEach((realse, instanceIndex) => {
    const flatInstance: { [key: string]: any } = {};
    properties.forEach((property) => {
      if (
        property === "author" ||
        property === "reactions" ||
        property === "assets"
      ) {
      } else {
        flatInstance[property] = realse[property] || "";
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
