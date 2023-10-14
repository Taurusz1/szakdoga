import sbomPackage from "@/models/package";
import sbom from "@/models/sbom";

const FilterSbom = (sbom: sbom) => {
  const packageNames = sbom.packages?.map((p: sbomPackage) => p.name!).sort();
  const githubLinks = packageNames.filter((str) =>
    str.startsWith("go:github.com")
  );

  const splitGithubLinks = githubLinks.map((g) => {
    return g.split("/").splice(1, 2);
  });
  const ownerRepo = splitGithubLinks.map((arr) => arr.join(","));
  const uniqueOwnerRepo = Array.from(new Set(ownerRepo));
  const uniqueOwnerRepoArrays = uniqueOwnerRepo.map((g) => {
    return g.split(",");
  });
  return uniqueOwnerRepoArrays;
};

export default FilterSbom;
