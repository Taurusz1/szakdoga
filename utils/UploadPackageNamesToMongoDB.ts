import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const UploadPackageNamesToMongoDB = async (packageNames: string[][]) => {
  const res = await fetch(
    publicRuntimeConfig.API_ENDPOINT + "/package/create",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(packageNames),
    }
  );
};

export default UploadPackageNamesToMongoDB;
