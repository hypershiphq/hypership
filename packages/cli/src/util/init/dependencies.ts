import { exec } from "child_process";
import fs from "fs";
import path from "path";

export const installDependencies = async (project: { name: string }) => {
  const rootDirectory = process.cwd();
  const hypershipProjectPath = path.join(rootDirectory, project.name);
  const hypershipStaticWebsitePath = path.join(hypershipProjectPath, "web");

  // Check if static website is in web directory or root directory
  const isStaticWebsiteInWebDirectory = fs.existsSync(
    hypershipStaticWebsitePath,
  );
  const staticWebsitePath = isStaticWebsiteInWebDirectory
    ? hypershipStaticWebsitePath
    : hypershipProjectPath;

  try {
    await new Promise((resolve, reject) => {
      exec(`cd ${staticWebsitePath} && npm i`, (error, stdout) => {
        if (error) reject(new Error("Failed to install dependencies"));
        resolve(stdout);
      });
    });
  } catch (error) {
    throw new Error("Failed to install dependencies");
  }
};
