import { HypershipClient } from "../client.js";

export const getUploadLink = async (
  authToken: string,
  projectId: string,
  deploymentId: string,
) => {
  const hypershipClient = new HypershipClient();

  try {
    const response = await hypershipClient.post(
      "/deploy/upload",
      {
        projectId: projectId,
        deploymentId: deploymentId,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    );

    const preSignedUrl = response?.data?.url;

    return preSignedUrl;
  } catch (error) {
    throw new Error("Unauthorized");
  }
};
