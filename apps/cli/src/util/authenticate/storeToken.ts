import fs from 'fs'
import path from 'path'
import XDGAppPaths from 'xdg-app-paths'

export const storeToken = (token: string) => {
  try {
    const directories = XDGAppPaths('com.hypership.cli').dataDirs();
    const configFile = path.join(directories[0], 'config.json');
    const configDir = path.dirname(configFile);

    // Ensure the directory exists
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(configFile, JSON.stringify({ token }, null, 2));
  } catch (error) {
    console.error('Error storing token:', error);
  }
}
