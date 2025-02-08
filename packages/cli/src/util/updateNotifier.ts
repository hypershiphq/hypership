import checkForUpdate from "update-check";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

let updateInfo: any | null = null;
let packageJson: any;

export const checkForUpdates = async () => {
  if (!updateInfo) {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const packageJsonPath = join(__dirname, "..", "package.json");
    packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
    try {
      updateInfo = await checkForUpdate(packageJson);
    } catch (err) {
      return;
    }
  }

  if (updateInfo) {
    const [currentMajor, currentMinor] = packageJson.version
      .split(".")
      .map(Number);
    const [latestMajor, latestMinor] = updateInfo.latest.split(".").map(Number);

    if (latestMajor > currentMajor || latestMinor > currentMinor) {
      console.log(`
        ⚡ \x1b[33mUpdate Available!\x1b[0m
        Your current version: \x1b[31m${packageJson.version}\x1b[0m
        Latest version: \x1b[32m${updateInfo.latest}\x1b[0m
        
        🚀 \x1b[36mRun the following command to update:\x1b[0m
        \x1b[1m  npm i -g hypership\x1b[0m
        `);
    }
  }
};
