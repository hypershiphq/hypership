import fs from "fs";
import path from "path";

export const checkIfHypershipProject = async (
  hypershipConfigFilePath: string,
) => {
  try {
    path.join(process.cwd(), ".hypership", "hypership.json");

    if (!fs.existsSync(hypershipConfigFilePath)) {
      throw new Error("No projects found");
    }
  } catch (error) {
    throw new Error("No projects found");
  }
};
