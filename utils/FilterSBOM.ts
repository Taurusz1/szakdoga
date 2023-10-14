import sbomPackage from "@/models/package";
import sbom from "@/models/sbom";

const FilterSbom = (sbom: sbom) => {
  const packageNames = sbom.packages?.map((p: sbomPackage) => p.name!).sort();
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
  const uniqueOwnerRepoArrays: string[][] = uniqueOwnerRepo.map((g: string) => {
    return g.split(",");
  });
  return uniqueOwnerRepoArrays;
};

export default FilterSbom;
