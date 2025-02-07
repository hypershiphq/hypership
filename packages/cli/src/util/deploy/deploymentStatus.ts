import { HypershipClient } from "../client.js";

export const pollDeploymentStatus = async (deploymentId: string) => {
  const hypershipClient = new HypershipClient();
  let status = null;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    try {
      const response = await hypershipClient.get(
        `/deploy/status?deploymentId=${deploymentId}`,
      );
      status = response.data.status;
      if (status === "success" || status === "failed") {
        break;
      }
    } catch (error) {
      throw new Error("Failed to get deployment status");
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
    attempts++;
  }

  if (status === null) {
    throw new Error(
      "Deployment status could not be determined within the polling time",
    );
  }

  return status;
};
