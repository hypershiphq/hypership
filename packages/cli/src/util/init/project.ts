import { HypershipClient } from "../client.js"


export const getUserProjects = async (authToken: string) => {
  try {
    const hypershipClient = new HypershipClient()

    const response = await hypershipClient.get('/projects', {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    const projects = response?.data?.projects
    if (!projects || projects.length === 0) {
      throw new Error('No projects found')
    }
  
    return projects
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      throw new Error('Unauthorized')
    }
    throw new Error('No projects found')
  }
}
