import axios from 'axios'
import fs from 'fs'
import JSZip from 'jszip'
import path from 'path'

export const createHypershipProjectDirectory = async (project: { name: string }) => {
  const newProjectPath = project.name

  try {
    fs.mkdirSync(newProjectPath, { recursive: true })
  } catch (error) {
    throw new Error()
  }
}

export const createWebDirectory = async (project: { name: string }) => {
  try {
    fs.mkdirSync(`${project.name}/web`, { recursive: true })
  } catch (error) {
    throw new Error()
  }
}

export const cloneHypershipFramework = async (project: { name: string }, appFramework: string) => {
  try {
    // Download zip file from the Hypership Framework and extract it
    const preSignedUrlApi = 'https://cli.hypership.dev/v1/deploy/download'

    const response = await axios.post(preSignedUrlApi, {
      framework: appFramework,
    })
    const preSignedUrl = response?.data?.data?.url

    const { data } = await axios.get(preSignedUrl, {
      responseType: 'arraybuffer',
    })

    const zip = await JSZip.loadAsync(data)
    for (const [fileName, zipEntry] of Object.entries(zip.files)) {
      if (!zipEntry.dir) {
        const fileData = await zipEntry.async('nodebuffer')

        const filePath = path.join(`${project.name}/web`, fileName)
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
        await fs.promises.writeFile(filePath, fileData)
      }
    }
  } catch (error) {
    throw new Error()
  }
}

export const createHypershipConfig = async (projectSlug: string, project: { name: string }) => {
  try {
    const config = {
      projectSlug: projectSlug
    }

    await fs.promises.mkdir(`${project.name}/.hypership`, { recursive: true })
    await fs.promises.writeFile(
      `${project.name}/.hypership/hypership.json`,
      JSON.stringify(config, null, 2)
    )
  } catch (error) {
    throw new Error()
  }
}

export const createEnvFile = async (publicKey: string, project: { name: string }) => {
  try {
    const env = `HYPERSHIP_PUBLIC_KEY=${publicKey}`

    await fs.promises.writeFile(
      `${project.name}/web/.env`,
      env
    )
  } catch (error) {
    throw new Error()
  }
}
