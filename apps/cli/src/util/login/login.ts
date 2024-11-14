import { HypershipClient } from '../client.js'


export const standardLogin = async (email: string, password: string) => {
  try {
    const hypershipClient = new HypershipClient()

    const accessToken = await hypershipClient.post('/auth/login', {
      email,
      password,
    })

    return accessToken
  } catch (error) {
    console.error(`Error logging in.`)
    throw error
  }
}