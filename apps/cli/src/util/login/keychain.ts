import keytar from 'keytar'

const SERVICE_NAME = 'Hypership'

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

export const getPasswordFromKeychain = async (email: string) => {
  try {
    const password = await keytar.getPassword(SERVICE_NAME, email)
    return password
  } catch (error) {
    console.error(`Error getting the password.`)
    return null
  }
}

export const checkKeychainCompatibility = async () => {
  try {
    await keytar.getPassword('keychainTest', 'keychainTest')
    return true
  } catch (error) {
    console.error('Keychain is not compatible.')
    return false
  }
}