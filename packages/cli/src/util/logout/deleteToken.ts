import fs from 'fs'
import path from 'path'
import XDGAppPaths from 'xdg-app-paths'

export const deleteStoredToken = async () => {
  try {
    const directories = XDGAppPaths('com.hypership.cli').dataDirs();
    const configFile = path.join(directories[0], 'config.json');

    if (fs.existsSync(configFile)) {
      fs.unlinkSync(configFile);
    }
  } catch (error) {
    console.error('Error deleting token:', error);
  }
}