import JSZip from 'jszip'
import fs from 'fs'
import path from 'path'

import { HypershipClient } from "../client.js"


export const cloneHypershipFramework = async (project: { name: string }, appFramework: string) => {
  try {
    const hypershipClient = new HypershipClient()

    const response = await hypershipClient.post('/deploy/download', {
      framework: appFramework,
    })

    const preSignedUrl = response?.data?.url
    if (!preSignedUrl) {
      throw new Error('Failed to get download URL')
    }

    const zipResponse = await hypershipClient.get<ArrayBuffer>(preSignedUrl, {
      responseType: 'arraybuffer'
    })

    if (!zipResponse) {
      throw new Error('Failed to download framework')
    }

    const zip = await JSZip.loadAsync(Buffer.from(zipResponse))
    
    for (const [fileName, zipEntry] of Object.entries(zip.files)) {
      if (!zipEntry.dir) {
        const fileData = await zipEntry.async('nodebuffer')
        const filePath = path.join(`${project.name}/web`, fileName)
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
        await fs.promises.writeFile(filePath, fileData)
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to clone framework: ${error.message}`)
    }
    throw new Error('Failed to clone framework')
  }
}