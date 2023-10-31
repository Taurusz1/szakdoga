import sbomPackage from "@/models/package";
import sbom from "@/models/sbom";

export const FilterSbom = (sbom: sbom) => {
  if (sbom.packages) {
    const packageNames = sbom.packages.map((p: sbomPackage) => p.name!).sort();
    const githubLinks: string[] = packageNames.filter((str: string) =>
      str.startsWith("go:github.com")
    );
    const splitGithubLinks: string[][] = githubLinks.map((g: string) => {
      return g.split("/").splice(1, 2);
    });
    const ownerRepo: string[] = splitGithubLinks.map((arr: string[]) =>
      arr.join(",")
    );
    const uniqueOwnerRepo: string[] = Array.from(new Set(ownerRepo));
    const uniqueOwnerRepoArrays: string[][] = uniqueOwnerRepo.map(
      (g: string) => {
        return g.split(",");
      }
    );
    return uniqueOwnerRepoArrays;
  }
  return null;
};

export const FormatSBOMName = (fullName: string) => {
  return fullName.split(".")[2].split("/");
};

export const FormatSBOMPackageName = (fullName: string) => {
  // Split the string by '/' to get the last part
  const parts = fullName.split("/");

  // Split the last part by ':' to get the desired components
  const components = [parts[1], parts[2]];

  return components;
};
