import { HypershipClient } from '../client.js'


export const standardLogin = async (email: string, password: string) => {
  try {
    const hypershipClient = new HypershipClient()

    const response = await hypershipClient.post('/auth/signIn', {
      email,
      password,
    })

    return response?.accessToken
  } catch (error) {
    throw new Error()
  }
}