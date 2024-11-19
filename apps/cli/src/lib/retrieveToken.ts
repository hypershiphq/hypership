import fs from 'fs'
import path from 'path'
import XDGAppPaths from 'xdg-app-paths'

export const retrieveToken = () => {
  try {
    const directories = XDGAppPaths('com.hypership.cli').dataDirs();
    const configFile = path.join(directories[0], 'config.json');

    const data = fs.readFileSync(configFile, 'utf8')
    const parsedData = JSON.parse(data)

    return parsedData?.token
  } catch (error) {
    throw new Error('Failed to retrieve token')
  }
}
