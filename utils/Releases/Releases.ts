import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export async function GetReleases(name: string[]) {
  const res = await fetch(
    publicRuntimeConfig.API_ENDPOINT + "/sbom/github/listReleases",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ owner: name[0], repo: name[1] }),
    }
  );
  const resData = await res.json();
  return resData;
}
