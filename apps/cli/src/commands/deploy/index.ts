import * as p from '@clack/prompts'
import { setTimeout } from 'node:timers/promises'
import path from 'path'
import color = require('picocolors')

import { retrieveToken } from '../../lib/retrieveToken.js'
import { retrieveProjectConfig } from '../../lib/retrieveProjectConfig.js'
import { checkIfHypershipProject } from '../../lib/checkHypership.js'

import { getUploadLink, deployStaticWebsite, deployAPI } from './utils.js'

export const deployProject = async () => {
  console.clear()

  // Initial check spinner
  let s = p.spinner()

  try {
    p.intro(color.bgCyan(color.black(' 🚀 Deploy Hypership App ')))
  
    // Check if the current directory is a Hypership project
    await checkIfHypershipProject(path.join(process.cwd(), '.hypership', 'hypership.json'))
  
    const projectSlug = retrieveProjectConfig()
    const authToken = retrieveToken()
  
    const preSignedUrl = await getUploadLink(projectSlug, authToken)
  
    // Deploy static website
    await deployStaticWebsite(preSignedUrl, s)
  
    // Deploy API - Coming soon
    // await deployAPI(preSignedUrl, s)
  
    s.start('Finalizing deployment...')
    await setTimeout(1000)
    s.stop(color.bgGreen(color.black(' Hypership Project Deployed Successfully! ')))
  
    p.note(`
      ${color.white(' Your Hypership Cloud Project: ')}
      ${color.white(color.bold(color.underline(`https://${projectSlug}.hypership.dev`)))}
    `)
  
    p.outro(`Problems? ${color.underline(color.cyan('https://hypership.dev/quick-start'))}`)
  } catch (error) {
    const err = error as Error;

    if (s) {
      if (err.message === 'Unauthorized') {
        s.stop(`${color.bgRed(color.white(' Unauthorized: '))} Your current session has expired. Please login again using ${color.underline(color.bold('hypership login'))}.`)
      } else {
        s.stop(`${color.red('Error creating new Hypership app. Please try again.')}`)
      }
    } else {
      p.cancel(`${color.bgRed(color.white(' Unauthorized: '))} Your current session has expired. Please login again using ${color.underline(color.bold('hypership login'))}.`)
    }

    process.exit(1)
  }
}
