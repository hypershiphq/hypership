import fs from "fs";
import path from "path";

export const retrieveProjectConfig = async () => {
  try {
    const configFile = path.join(process.cwd(), ".hypership", "hypership.json");

    const data = fs.readFileSync(configFile, "utf8");
    const parsedData = JSON.parse(data);

    return parsedData?.hypershipId;
  } catch (error) {
    throw new Error("Failed to retrieve project config");
  }
};
