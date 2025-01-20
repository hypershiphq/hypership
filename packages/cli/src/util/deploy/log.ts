import { HypershipClient } from "../client.js";

export const log = async (
  authToken: string,
  status: string,
  message: string,
  deploymentId: string,
  projectId: string,
) => {
  const hypershipClient = new HypershipClient();

  try {
    const response = await hypershipClient.post(
      `/deploy/log`,
      {
        status: status,
        message: message,
        deploymentId: deploymentId,
        projectId: projectId,
      },
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    );

    return response?.data?.id;
  } catch (error) {
    throw new Error("Failed to log deployment");
  }
};
