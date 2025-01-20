import fs from "fs";

interface Project {
  name: string;
}

const createDirectory = (path: string) => {
  try {
    fs.mkdirSync(path, { recursive: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to create directory at ${path}: ${error.message}`,
      );
    }
    throw new Error(`Failed to create directory at ${path}`);
  }
};

export const createHypershipProjectDirectory = async (project: Project) => {
  createDirectory(project.name);
};

export const createWebDirectory = async (project: Project) => {
  createDirectory(`${project.name}/web`);
};
