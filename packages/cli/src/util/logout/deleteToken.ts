import fs from 'fs'
import os from 'os'
import path from 'path'

export const deleteStoredToken = async () => {
  try { 
    const homeDir = os.homedir()
    const configDir = path.join(homeDir, '.hypership')
    const configFile = path.join(configDir, 'hypership.json')

    if (fs.existsSync(configFile)) {
      fs.unlinkSync(configFile)
    }
  } catch (error) {
    console.error(`Error deleting the token: ${error}`)
  }
}