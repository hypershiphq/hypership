import * as p from '@clack/prompts'
import { setTimeout } from 'node:timers/promises'
import path from 'path'
import color = require('picocolors')

import { retrieveToken } from '../../lib/retrieveToken.js'
import { retrieveProjectConfig } from '../../util/deploy/projectConfig.js'
import { getProjectDetails } from '../../util/projectDetails.js'
import { checkIfHypershipProject } from '../../util/deploy/checkHypership.js'
import { getUploadLink } from '../../util/deploy/upload.js'
import { deployStaticWebsite } from '../../util/deploy/staticWebsite.js'

import { ERROR_MESSAGES, ErrorMessageKey } from '../../constants/errorMessages.js'

export const deployProject = async () => {
  console.clear()

  // Initial check spinner
  let s = p.spinner()
  
  p.intro(color.bgCyan(color.black(' 🚀 Deploy Hypership App ')))

  s.start('Building static website...')

  try {
    // Check if the current directory is a Hypership project
    await checkIfHypershipProject(path.join(process.cwd(), '.hypership', 'hypership.json'))
  
    const authToken = retrieveToken()
    const projectId = retrieveProjectConfig()
    const projectDetails = await getProjectDetails(authToken, { projectId })
  
    const preSignedUrl = await getUploadLink(authToken, projectId)
  
    // Deploy static website
    await deployStaticWebsite(preSignedUrl, s)

    await setTimeout(1000)
    s.stop(color.bgGreen(color.black(' Hypership Project Deployed Successfully! ')))
  
    p.note(`
      ${color.white(' Your Hypership Project: ')}
      ${color.white(color.bold(color.underline(`https://${projectDetails?.slug}.hypership.dev`)))}
    `)
  
    p.outro(`Problems? ${color.underline(color.cyan('https://hypership.dev/quick-start'))}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'default'

    if (s) {
      s.stop(ERROR_MESSAGES[message as ErrorMessageKey] || ERROR_MESSAGES.defaultDeploy)
    } else {
      p.cancel(ERROR_MESSAGES[message as ErrorMessageKey] || ERROR_MESSAGES.defaultDeploy)
    }

    process.exit(1)
  } 
}
