import axios from 'axios'
import fs from 'fs'
import keytar from 'keytar'
import os from 'os'
import path from 'path'

const SERVICE_NAME = 'Hypership'

export const storeToken = (token: string) => {
  try {
    const homeDir = os.homedir()
    const configDir = path.join(homeDir, '.hypership')
    const configFile = path.join(configDir, 'hypership.json')

    // Ensure the directory exists
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir)
    }

    // Write or overwrite the file with the new token
    fs.writeFileSync(configFile, JSON.stringify({ authToken: token }), 'utf8')
  } catch (error) {
    console.error(`Error storing the token: ${error}`)
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const response = await axios.post('https://cli.hypership.dev/v1/auth/login', {
      email,
      password,
    })

    return response?.data?.data?.token
  } catch (error) {
    return null
  }
}

export const storePassword = async (username: string, password: string) => {
  try {
    await keytar.setPassword(SERVICE_NAME, username, password)
  } catch (error) {
    console.error(`Error storing the password.`)
  }
}

export const deleteStoredPassword = async (username: string) => {
  try {
    await keytar.deletePassword(SERVICE_NAME, username)
  } catch (error) {
    console.error(`Error deleting the password.`)
  }
}

export const getPasswordFromKeychain = async (email: string): Promise<string | null> => {
  try {
    const password = await keytar.getPassword(SERVICE_NAME, email)
    return password
  } catch (error) {
    return null
  }
}

export const checkKeychainCompatibility = async () => {
  try {
    await keytar.getPassword('nonExistentServiceForTest', 'nonExistentAccount')
    return true
  } catch (error) {
    return false
  }
}