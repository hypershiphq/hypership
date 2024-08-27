import * as p from '@clack/prompts'
import fs from 'fs'
import os from 'os'
import path from 'path'

export const retrieveToken = (): string => {
  const homeDir = os.homedir()
  const configDir = path.join(homeDir, '.hypership')
  const configFile = path.join(configDir, 'hypership.json')

  try {
    const data = fs.readFileSync(configFile, 'utf8')
    const parsedData = JSON.parse(data)
    return parsedData.authToken
  } catch (error) {
    p.cancel('You are not logged in. Please login using `hypership login`.')
    process.exit(1)
  }
}
