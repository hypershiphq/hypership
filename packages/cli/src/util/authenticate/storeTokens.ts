import fs from 'fs'
import path from 'path'
import XDGAppPaths from 'xdg-app-paths'

export const storeTokens = (accessToken: string, refreshToken: string | null) => {
  try {
    const directories = XDGAppPaths('com.hypership.cli').dataDirs();
    const configFile = path.join(directories[0], 'config.json');
    const configDir = path.dirname(configFile);

    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(configFile, JSON.stringify({ accessToken, refreshToken }, null, 2));
  } catch (error) {
    throw new Error('Error storing tokens')
  }
}
