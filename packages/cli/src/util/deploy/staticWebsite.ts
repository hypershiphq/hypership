import archiver from "archiver";
import axios from "axios";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import type { Ora } from "ora";

import { pollDeploymentStatus } from "./deploymentStatus.js";
import { HypershipClient } from "../client.js";

export const deployStaticWebsite = async (
  authToken: string,
  projectId: string,
  preSignedUrl: string,
  deploymentId: string,
  framework: string,
  spinner: Ora
) => {
  spinner.text = "Installing dependencies";

  const rootDirectory = process.cwd();
  const hypershipStaticWebsitePath = path.join(rootDirectory, "web");
  const zipPath = path.join(rootDirectory, ".hypership", `${deploymentId}.zip`);

  // Check if static website is in web directory or root directory
  const isStaticWebsiteInWebDirectory = fs.existsSync(
    hypershipStaticWebsitePath
  );
  const staticWebsitePath = isStaticWebsiteInWebDirectory
    ? hypershipStaticWebsitePath
    : rootDirectory;

  if (!fs.existsSync(staticWebsitePath)) {
    return;
  }

  try {
    // Install dependencies
    await new Promise((resolve, reject) => {
      exec(`cd ${staticWebsitePath} && npm i`, (error, stdout, stderr) => {
        if (error) {
          console.log("\n\nError installing dependencies:", stderr);
          reject(new Error("Failed to install dependencies"));
        } else {
          resolve(stdout);
        }
      });
    });

    spinner.text = "Building (this may take a couple of minutes)";

    // Remove .open-next & .next directory
    if (fs.existsSync(path.join(staticWebsitePath, ".open-next"))) {
      await fs.promises.rm(path.join(staticWebsitePath, ".open-next"), {
        recursive: true,
      });
    }

    if (fs.existsSync(path.join(staticWebsitePath, ".next"))) {
      const nextDir = path.join(staticWebsitePath, ".next");
      const files = await fs.promises.readdir(nextDir);
      for (const file of files) {
        if (file !== "app-build-manifest.json") {
          await fs.promises.rm(path.join(nextDir, file), {
            recursive: true,
            force: true,
          });
        }
      }
    }

    // Env vars
    const hypershipClient = new HypershipClient();
    const response = await hypershipClient.get(
      `/projects/envVars?projectId=${projectId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    const envVars = response?.data?.envVars;
    if (!envVars) {
      throw new Error("Failed to retrieve environment variables");
    }

    const envVarsString = Object.entries(envVars)
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join(" ");

    // Build
    await new Promise((resolve, reject) => {
      const buildCommand =
        framework === "next" || framework === "next-static"
          ? `npx cross-env NODE_ENV=production ${envVarsString} npx --yes open-next build`
          : `npx cross-env NODE_ENV=production ${envVarsString} npm run build`;

      // Create open-next.config.js
      fs.writeFileSync(
        path.join(staticWebsitePath, "open-next.config.ts"),
        `const config = {
          default: {
            minify: true,
          },
          dangerous: {
            disableTagCache: true,
            disableIncrementalCache: true,
          } 
        }
        export default config;`
      );

      exec(
        `cd ${staticWebsitePath} && ${buildCommand}`,
        (error, stdout, stderr) => {
          if (error) {
            const filteredStderr = stderr
              .split('\n')
              .filter(line => !line.includes("WARN You've disabled incremental cache.") && 
                              !line.includes("WARN You've disabled tag cache.") && 
                              !line.includes("It is safe to disable if you only use page router") &&
                              !line.includes("This means that revalidatePath and revalidateTag from next/cache will not work."))
              .join('\n');
            console.error("\n\nError during build:", filteredStderr);
            reject(new Error("Failed to build the project"));
          } else {
            resolve(stdout);
          }
        }
      );
    });

    const distPath = fs.existsSync(path.join(staticWebsitePath, "dist"))
      ? path.join(staticWebsitePath, "dist")
      : fs.existsSync(path.join(staticWebsitePath, "build"))
        ? path.join(staticWebsitePath, "build")
        : path.join(staticWebsitePath, ".open-next");

    if (!fs.existsSync(distPath)) {
      throw new Error(
        "Build directory (dist) not found. Build may have failed."
      );
    }

    // Zip
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("warning", function (err) {
      if (err.code === "ENOENT") {
        console.warn("Zip warning:", err);
      } else {
        throw err;
      }
    });

    archive.on("error", (err) => {
      throw err;
    });

    await new Promise((resolve, reject) => {
      output.on("close", resolve);
      archive.on("error", reject);
      archive.pipe(output);
      archive.directory(distPath, false);
      archive.finalize();
    });

    spinner.text = "Deploying";

    // Upload
    const zipFileStream = fs.createReadStream(zipPath);
    await axios.put(preSignedUrl, zipFileStream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Length": fs.statSync(zipPath).size,
      },
    });

    // Clean up
    await fs.promises.unlink(zipPath);
    await fs.promises.rm(distPath, { recursive: true });
    await fs.promises.rm(path.join(staticWebsitePath, "open-next.config.ts"));

    if (framework === "next") {
      const nextDir = path.join(staticWebsitePath, ".next");
      const files = await fs.promises.readdir(nextDir);
      for (const file of files) {
        if (file !== "app-build-manifest.json") {
          await fs.promises.rm(path.join(nextDir, file), {
            recursive: true,
            force: true,
          });
        }
      }
    }

    // Poll for deployment status
    const status = await pollDeploymentStatus(deploymentId);

    if (status === "failed") {
      throw new Error("Failed to deploy static website");
    }

    spinner.text = "Deployed successfully";
  } catch (error) {
    // Clean up build directories
    await fs.promises.rm(distPath, { recursive: true, force: true });
    if (framework === "next") {
      await fs.promises.rm(path.join(staticWebsitePath, "open-next.config.ts"));
      const nextDir = path.join(staticWebsitePath, ".next");
      const files = await fs.promises.readdir(nextDir);
      for (const file of files) {
        if (file !== "app-build-manifest.json") {
          await fs.promises.rm(path.join(nextDir, file), {
            recursive: true,
            force: true,
          });
        }
      }
    }

    if (
      error instanceof Error &&
      error.message === "Failed to build the project"
    ) {
      throw new Error("Failed to build the project");
    }
    throw new Error("Failed to deploy static website");
  }
};
