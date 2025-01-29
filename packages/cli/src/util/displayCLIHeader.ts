import { readFileSync } from "fs";
import { join, dirname } from "path";
import color from "picocolors";
import { fileURLToPath } from "url";

const getCliVersion = () => {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const packageJsonPath = join(__dirname, "..", "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
    return packageJson.version;
  } catch {
    return "unknown";
  }
};

export const displayCLIHeader = () => {
  const version = getCliVersion();
  console.log(`${color.cyan("Hypership CLI")} ${color.dim(`v${version}`)}`);
};
