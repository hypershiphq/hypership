import { HypershipClient } from '../client.js'


export const standardLogin = async (email: string, password: string) => {
  try {
    const hypershipClient = new HypershipClient()

    const response = await hypershipClient.post('/auth/signIn', {
      email,
      password,
    })

    return {
      accessToken: response?.data?.accessToken,
      refreshToken: response?.data?.refreshToken
    }
  } catch (error) {
    throw new Error('Unauthorized')
  }
}