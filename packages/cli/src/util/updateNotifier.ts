import updateNotifier from "update-notifier";
import { readFileSync } from "fs";
import { join, dirname } from "path";

let notifier: updateNotifier.UpdateNotifier | null = null;

export const checkForUpdates = async () => {
  if (!notifier) {
    const __dirname = dirname(new URL(import.meta.url).pathname);
    const packageJsonPath = join(__dirname, "..", "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
    notifier = updateNotifier({ 
      pkg: packageJson,
      updateCheckInterval: 1000 * 60 * 60 * 24
    });
  }

  const updateInfo = await notifier.fetchInfo();
  
  const [currentMajor, currentMinor] = updateInfo.current.split('.').map(Number);
  const [latestMajor, latestMinor] = updateInfo.latest.split('.').map(Number);
  
  if (latestMajor > currentMajor || latestMinor > currentMinor) {
    notifier.notify({
      message: `Update available ${updateInfo.current} → ${updateInfo.latest}\nRun npm i -g hypership to update`
    });
  }
};
