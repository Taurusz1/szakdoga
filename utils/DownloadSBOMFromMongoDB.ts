import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const DownloadSBOMFromMongoDB = async (id: string) => {
  const uploadresult = await fetch(
    publicRuntimeConfig.API_ENDPOINT + "/sbom/" + id
  );
  const data = await uploadresult.json();
  return data;
};

export default DownloadSBOMFromMongoDB;
