import { HypershipClient } from "./client.js";

import { ProjectIdentifier } from "../types.js";

export const getProjectDetails = async (
  authToken: string,
  identifier: ProjectIdentifier,
) => {
  try {
    const hypershipClient = new HypershipClient();

    const response = await hypershipClient.post("/projects/clone", identifier, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response?.data) {
      throw new Error("Failed to fetch project details");
    }

    return response?.data;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch project details");
  }
};
