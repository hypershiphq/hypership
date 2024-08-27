import axios, { AxiosError } from 'axios'

export const getUserProjects = async (authToken: string) => {
  try {
    const response = await axios.get('https://cli.hypership.dev/v1/projects', {
      headers: { Authorization: `Bearer ${authToken}` },
    })
  
    return response?.data?.data?.projects
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

export const getProjectDetails = async (authToken: string, projectLabel: string, projectCreatedAt: string) => {
  const response = await axios.post('https://cli.hypership.dev/v1/projects/clone', {
    projectLabel: projectLabel,
    projectCreatedAt: projectCreatedAt,
  }, {
    headers: { Authorization: `Bearer ${authToken}` },
  })

  return response?.data?.data
}
