import fs from 'fs'
import path from 'path'
import XDGAppPaths from 'xdg-app-paths'

import { HypershipClient } from '../util/client.js'

export const retrieveToken = async () => {
  try {
    const directories = XDGAppPaths('com.hypership.cli').dataDirs();
    const configFile = path.join(directories[0], 'config.json');

    const data = fs.readFileSync(configFile, 'utf8')
    const parsedData = JSON.parse(data)

    let { accessToken, refreshToken } = parsedData;

    // Check if the access token is valid
    const hypershipClient = new HypershipClient(accessToken);
    try {
      await hypershipClient.get('/auth/validate-token', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch (error) {
      if (refreshToken) {
        const response = await hypershipClient.post('/auth/refreshToken', { refreshToken }, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        accessToken = response.accessToken;
        refreshToken = response.refreshToken;

        fs.writeFileSync(configFile, JSON.stringify({ accessToken, refreshToken }, null, 2));
      } else {
        throw new Error('No refresh token available');
      }
    }

    return accessToken;
  } catch (error) {
    throw new Error('Failed to retrieve token');
  }
}
