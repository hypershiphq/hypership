import keytar from 'keytar'

const SERVICE_NAME = 'Hypership'

export const deleteStoredPassword = async () => {
  try { 
    await keytar.findCredentials(SERVICE_NAME).then((result) => {
      result.forEach(async (credential) => {
      await keytar.deletePassword(SERVICE_NAME, credential.account)
      })
    })
  } catch (error) {
    console.error(`Error deleting the password.`)
  }
}