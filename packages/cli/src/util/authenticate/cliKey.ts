import { HypershipClient } from '../client.js'


export const cliKeyAuthentication = async (cliKey: string) => {
  try {
    const hypershipClient = new HypershipClient()

    const response = await hypershipClient.post('/auth/verify-cli-key', {
      cliKey,
    })

    return response?.accessToken
  } catch (error) {
    throw new Error('Unauthorized')
  }
}