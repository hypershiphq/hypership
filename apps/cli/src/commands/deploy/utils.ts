import archiver from 'archiver'
import axios, { AxiosError } from 'axios'
import { exec } from 'child_process'
import * as p from '@clack/prompts'
import * as color from 'picocolors';
import fs from 'fs'
import path from 'path'

import { Spinner } from '../../types.js'

export const getUploadLink = async (projectSlug: string, authToken: string) => {
  const preSignedUrlApi = 'https://cli.hypership.dev/v1/deploy/upload'
  let response, preSignedUrl

  try {
    response = await axios.post(preSignedUrlApi, {
      projectSlug: projectSlug
    }, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    preSignedUrl = response?.data?.data?.url

    return preSignedUrl
  } catch (error) {
    const axiosError = error as AxiosError

    if (axiosError?.response?.status === 401) {
      throw new Error('Unauthorized')
    } else {
      throw new Error()
    }
  }
}

export const deployStaticWebsite = async (preSignedUrl: string, s: Spinner) => {
  try {
    // Check for static website
    const hypershipStaticWebsitePath = path.join(process.cwd(), 'web')

    if (fs.existsSync(hypershipStaticWebsitePath)) {
      s = p.spinner()
      s.start('Building static website...')

      // Build
      try {
        await new Promise((resolve, reject) => {
          exec('cd web && npm i && npm run build', (error, stdout, stderr) => {
            if (error) {
              s.stop(`${color.bgRed(color.white(' Error: '))} Failed to build the project. Please try again.`)
              process.exit(1)
            }
            resolve(stdout)
            s.stop('Static website built successfully.')
          })
        })
      } catch (error) {
        process.exit(1)
      }

      s.start('Deploying static website...')

      // Zip
      const zipPath = path.join(process.cwd(), '.hypership', 'build.zip')
      const output = fs.createWriteStream(zipPath)
      const archive = archiver('zip', { zlib: { level: 9 } })

      archive.on('error', (err) => {
        throw err
      })

      await new Promise((resolve, reject) => {
        output.on('close', resolve)
        archive.on('error', reject)
        archive.pipe(output)
        archive.directory(`${hypershipStaticWebsitePath}/build`, false)
        archive.finalize()
      })

      // Upload
      try {
        const zipFileStream = fs.createReadStream(zipPath)
        await axios.put(preSignedUrl, zipFileStream, {
          headers: {
            'Content-Type': 'application/zip',
            'Content-Length': fs.statSync(zipPath).size,
          },
        })
      } catch (error) {
        console.error('Error uploading the zip file:', error)
        process.exit(1)
      }

      // Clean up
      try {
        await fs.promises.unlink(zipPath)
      } catch (error) {
        s.stop('Failed to delete build.zip file.')
        process.exit(1)
      }

      s.stop('Static website deployed successfully.')
    } else {
      p.note(`${color.yellow('Static website not found. Skipping...')}`)
    }
  } catch (error) {
    throw new Error()
  }
}

export const deployAPI = async (preSignedUrl: string, s: Spinner) => {
  try {
    // Check for API
    const hypershipAPIPath = path.join(process.cwd(), 'api')

    if (fs.existsSync(hypershipAPIPath)) {
      s.start('Deploying API...')
      s.stop('API deployed successfully.')
    } else {
      p.note(color.yellow('API not found. Skipping...'))
    }
  } catch (error) {
    throw new Error()
  }
}
