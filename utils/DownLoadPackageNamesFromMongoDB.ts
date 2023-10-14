import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const DownloadPackageNamesFromMongoDB = async () => {
  const res = await fetch(publicRuntimeConfig.API_ENDPOINT + "/package");
  const data = await res.json();
  return data;
};

export default DownloadPackageNamesFromMongoDB;
