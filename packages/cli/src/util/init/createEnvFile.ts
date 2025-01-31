import fs from "fs";
import path from "path";

import { HypershipClient } from "../client.js";

export const createEnvFile = async (
  authToken: string,
  projectId: string,
  project: { name: string; },
  framework: string,
) => {
  try {
    const rootDirectory = process.cwd();
    const envFilePath = path.join(rootDirectory, project.name, ".env");

    const hypershipClient = new HypershipClient();
    const response = await hypershipClient.get(
      `/projects/keys?projectId=${projectId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      },
    );

    const publicKey = response?.data?.publicKey;
    if (!publicKey) {
      throw new Error("Failed to retrieve Public Key");
    }

    let envFileContent = "";

    if (framework === "react") {
      envFileContent = `VITE_HYPERSHIP_PUBLIC_KEY=${publicKey}`;
    } else if (framework === "next") {
      envFileContent = `NEXT_PUBLIC_HYPERSHIP_PUBLIC_KEY=${publicKey}`;
    }

    await fs.promises.writeFile(envFilePath, envFileContent);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create .env file: ${error.message}`);
    }
    throw new Error("Failed to create .env file");
  }
};
