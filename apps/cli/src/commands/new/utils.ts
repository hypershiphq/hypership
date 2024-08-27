import axios, { AxiosError } from 'axios'

import { retrieveToken } from '../../lib/retrieveToken.js'


export const createProject = async (project: { name: string }, framework: string) => {
  try {
    // Try to get user token
    const authToken = retrieveToken()

    let headers = {}

    if (authToken) {
      headers = { Authorization: `Bearer ${authToken}` }
    }

    // Get slug name from the project
    const newProject = await axios.post('https://cli.hypership.dev/v1/projects', {
      projectName: project.name,
      framework,
    }, {
      headers: headers,
    })

    return {
      slugName: newProject?.data?.data?.project?.slug,
      publicKey: newProject?.data?.data?.project?.publicKey,
      secretKey: newProject?.data?.data?.project?.secretKey,
    }
  } catch (error) {
    const axiosError = error as AxiosError
    if (axiosError?.response && axiosError?.response?.status === 401) {
      // Return unauthorized error
      throw new Error('Unauthorized');
    } else {
      throw new Error()
    }
  }
}

export const deployNewProject = async (appFramework: string, projectSlug: string) => {
  try {
    const deployApiUrl = 'https://cli.hypership.dev/v1/deploy/new'

    await axios.post(deployApiUrl, {
      framework: appFramework,
      projectSlug: projectSlug,
    })
  } catch (error) {
    console.log(error)
    throw new Error()
  }
}
