import fs from 'fs'
import keytar from 'keytar'
import os from 'os'
import path from 'path'

const SERVICE_NAME = 'Hypership'

export const deleteStoredPassword = async () => {
  await keytar.findCredentials(SERVICE_NAME).then((result) => {
    result.forEach(async (credential) => {
      await keytar.deletePassword(SERVICE_NAME, credential.account)
    })
  })
}

export const deleteStoredToken = async () => {
  const homeDir = os.homedir()
  const configDir = path.join(homeDir, '.hypership')
  const configFile = path.join(configDir, 'hypership.json')

  if (fs.existsSync(configFile)) {
    fs.unlinkSync(configFile)
  }
}