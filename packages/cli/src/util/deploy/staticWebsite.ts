import * as p from '@clack/prompts'
import archiver from 'archiver'
import axios from 'axios'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import * as color from 'picocolors'

import { Spinner } from '../../types.js'

export const deployStaticWebsite = async (preSignedUrl: string, s: Spinner) => {
  const rootDirectory = process.cwd()
  const hypershipStaticWebsitePath = path.join(rootDirectory, 'web')
  const zipPath = path.join(rootDirectory, '.hypership', 'build.zip')

  // Check if static website is in web directory or root directory
  const isStaticWebsiteInWebDirectory = fs.existsSync(hypershipStaticWebsitePath)
  const staticWebsitePath = isStaticWebsiteInWebDirectory ? hypershipStaticWebsitePath : rootDirectory

  if (!fs.existsSync(staticWebsitePath)) {
    p.note(`${color.yellow('Static website not found. Skipping...')}`)
    return
  }

  try {
    // Build
    await new Promise((resolve, reject) => {
      exec(`cd ${staticWebsitePath} && npm i && npm run build`, (error, stdout) => {
        if (error) reject(new Error('Failed to build the project'))
        resolve(stdout)
        s.stop('Static website built successfully.')
      })
    })

    s.start('Deploying static website...')

    // Zip
    const output = fs.createWriteStream(zipPath)
    const archive = archiver('zip', { zlib: { level: 9 } })
    
    archive.on('error', (err) => { throw err })
    
    await new Promise((resolve, reject) => {
      output.on('close', resolve)
      archive.on('error', reject)
      archive.pipe(output)
      archive.directory(`${staticWebsitePath}/build`, false)
      archive.finalize()
    })

    // Upload
    const zipFileStream = fs.createReadStream(zipPath)
    await axios.put(preSignedUrl, zipFileStream, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Length': fs.statSync(zipPath).size,
      },
    })

    // Clean up
    await fs.promises.unlink(zipPath)
    s.stop('Static website deployed successfully.')

  } catch (error) {
    throw new Error('Failed to deploy static website')
  }
}
