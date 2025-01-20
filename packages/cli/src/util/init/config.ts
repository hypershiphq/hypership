import fs from "fs";

export const createHypershipConfig = async (
  projectId: string,
  project: { name: string },
) => {
  try {
    const config = {
      hypershipId: projectId,
    };

    await fs.promises.mkdir(`${project.name}/.hypership`, { recursive: true });
    await fs.promises.writeFile(
      `${project.name}/.hypership/hypership.json`,
      JSON.stringify(config, null, 2),
    );
  } catch (error) {
    throw new Error("Failed to create hypership config");
  }
};
