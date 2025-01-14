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

    console.log(accessToken, refreshToken)
    console.log(parsedData)

    // Check if the access token is valid
    const hypershipClient = new HypershipClient(accessToken);
    try {
      await hypershipClient.get('/auth/validateToken');
    } catch (error) {
      console.log('Token is invalid, refreshing...')
      if (refreshToken) {
        console.log('Refreshing token...')
        const refreshClient = new HypershipClient();
        const response = await refreshClient.post('/auth/refreshToken', { refreshToken });
        accessToken = response.accessToken;
        refreshToken = response.refreshToken;

        fs.writeFileSync(configFile, JSON.stringify({ accessToken, refreshToken }, null, 2));
      } else {
        throw new Error('No refresh token available');
      }
    }

    return accessToken;
  } catch (error) {
    console.log(error)
    throw new Error('Failed to retrieve token');
  }
}
