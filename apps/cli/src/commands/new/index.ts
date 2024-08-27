import * as p from '@clack/prompts'
import fs from 'fs'
import { setTimeout } from 'node:timers/promises'
import color = require('picocolors')

import { createProject, deployNewProject } from './utils.js'
import {
  createHypershipProjectDirectory,
  createWebDirectory,
  cloneHypershipFramework,
  createHypershipConfig,
  createEnvFile
} from '../../lib/createNewProject.js'
import { FrontendOption, FrontendOptionResponse } from '../../types.js'


export const createNewProject = async () => {
  let project: { name: string } = { name: '' }
  let s

  try {
    console.clear()

    await setTimeout(1000)

    p.intro(`${color.bgCyan(color.black(' 🚀 New Hypership App '))}`)

    project = await p.group(
      {
        name: () =>
          p.text({
            message: 'What should we call your new Hypership app?',
            placeholder: 'my-new-app',
            validate: (value) => {
              // Check if the input is empty
              if (!value) return 'Please enter a name for your new Hypership app.'
              // Check for length restrictions
              if (value.length < 3 || value.length > 30) return 'The name must be between 3 and 30 characters long.'
              // Check for invalid characters (allowing only alphanumeric characters and hyphens)
              if (!/^[a-zA-Z0-9-]+$/.test(value)) return 'The name can only contain alphanumeric characters and hyphens.'
              // Check for leading or trailing hyphens
              if (/^-|-$/.test(value)) return 'The name cannot start or end with a hyphen.'
              // Check for consecutive hyphens
              if (value.includes('--')) return 'The name cannot contain consecutive hyphens.'
            },
          }),
      }
    )

    await createHypershipProjectDirectory(project)

    const appFramework = await p.select<FrontendOption[], FrontendOptionResponse>({
      message: 'Which frontend framework would you like to use? (Next, Svelte, Vue coming soon)',
      options: [
        { value: 'react', label: 'React' },
        // { value: 'next', label: 'Next.js (Coming soon)' },
        // { value: 'svelte', label: 'Svelte (Coming soon)' },
        // { value: 'vue', label: 'Vue.js (Coming soon)' },
      ],
    })

    await createWebDirectory(project)

    // Clone the Hypership Framework
    s = p.spinner()
    s.start(`Cloning Hypership Framework to ${project.name}...`)

    await cloneHypershipFramework(project, appFramework as string)

    const projectDetails = await createProject(project, appFramework as string)

    await createHypershipConfig(projectDetails.slugName, project)

    await createEnvFile(projectDetails.publicKey, project)

    s.stop(`Cloned to ${project.name}`)

    // Now deploy the new project to Hypership
    s.start('Deploying new Hypership Project...')

    await deployNewProject(appFramework as string, projectDetails.slugName)

    s.stop(`Hypership Project Deployed`)

    // Display the project URL
    p.note(`
      ${color.green(' Your Hypership Cloud Project: ')}
      ${color.white(color.bold(color.underline(`https://${projectDetails.slugName}.hypership.dev`)))}
    `)

    p.outro(`Problems? ${color.underline(color.cyan('https://hypership.dev/quick-start'))}`)
  } catch (error) {
    // Delete the directory if the app creation fails
    if (fs.existsSync(project.name)) {
      fs.rmSync(project.name, { recursive: true, force: true })
    }

    const err = error as Error;

    if (s) {
      if (err.message === 'Unauthorized') {
        s.stop(`${color.bgRed(color.white(' Unauthorized: '))} Your current session has expired. Please login again using ${color.underline(color.bold('hypership login'))}.`)
      } else {
        s.stop(`${color.red('Error creating new Hypership app. Please try again.')}`)
      }
    } else {
      p.cancel('Error creating new Hypership app. Please try again.')
    }

    process.exit(1)
  }
}
