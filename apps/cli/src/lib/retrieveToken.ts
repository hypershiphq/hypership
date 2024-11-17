import * as p from '@clack/prompts'
import fs from 'fs'
import path from 'path'
import XDGAppPaths from 'xdg-app-paths'

export const retrieveToken = () => {
  try {
    const directories = XDGAppPaths('com.hypership.cli').dataDirs();
    const configFile = path.join(directories[0], 'config.json');

    const data = fs.readFileSync(configFile, 'utf8')
    const parsedData = JSON.parse(data)
    return parsedData.token
  } catch (error) {
    p.cancel('You are not logged in. Please login using `hypership login`.')
    process.exit(1)
  }
}