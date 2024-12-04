import keytar from 'keytar'

const SERVICE_NAME = 'Hypership'

export const storePassword = async (username: string, password: string) => {
  try {
    await keytar.setPassword(SERVICE_NAME, username, password)
  } catch (error) {
    throw new Error('Failed to store password')
  }
}

export const deleteStoredPassword = async (username: string) => {
  try {
    await keytar.deletePassword(SERVICE_NAME, username)
  } catch (error) {
    throw new Error('Failed to delete password')
  }
}

export const getPasswordFromKeychain = async (email: string) => {
  try {
    const password = await keytar.getPassword(SERVICE_NAME, email)
    return password
  } catch (error) {
    return null
  }
}

export const checkKeychainCompatibility = async () => {
  try {
    await keytar.getPassword('keychainTest', 'keychainTest')
    return true
  } catch (error) {
    return false
  }
}