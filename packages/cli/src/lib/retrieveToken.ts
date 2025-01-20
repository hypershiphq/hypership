import fs from "fs";
import path from "path";
import XDGAppPaths from "xdg-app-paths";

import { HypershipClient } from "../util/client.js";
import { storeTokens } from "../util/authenticate/storeTokens.js";

export const retrieveToken = async () => {
  try {
    const directories = XDGAppPaths("com.hypership.cli").dataDirs();
    const configFile = path.join(directories[0], "config.json");

    const data = fs.readFileSync(configFile, "utf8");
    const parsedData = JSON.parse(data);

    let { accessToken, refreshToken } = parsedData;

    // Check if the access token is valid
    const hypershipClient = new HypershipClient();
    try {
      await hypershipClient.get("/auth/validateToken", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return accessToken;
    } catch (error) {
      if (refreshToken) {
        const response = await hypershipClient.post("/auth/refreshToken", {
          refreshToken: refreshToken,
        });

        accessToken = response.data.accessToken;
        refreshToken = response.data.refreshToken;

        storeTokens(accessToken, refreshToken);
        return accessToken;
      } else {
        throw new Error("No refresh token available");
      }
    }
  } catch (error) {
    throw new Error("Failed to retrieve token");
  }
};
