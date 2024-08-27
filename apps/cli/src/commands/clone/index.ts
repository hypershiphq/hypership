import * as p from '@clack/prompts'
import fs from 'fs'
import color = require('picocolors')

import { retrieveToken } from '../../lib/retrieveToken.js'
import { 
  createHypershipProjectDirectory,
  createWebDirectory,
  cloneHypershipFramework,
  createHypershipConfig,
} from '../../lib/createNewProject.js'
import { getUserProjects, getProjectDetails } from './utils.js'

import { CloneProjectOption, CloneProjectOptionResponse } from '../../types.js'

export const cloneProject = async () => {
  console.clear()

  // Initial check spinner
  let s = p.spinner()

  p.intro(color.bgCyan(color.black(' 🚀 Clone Hypership App ')))

  const authToken = retrieveToken()

  let project: { name: string } = { name: '' }

  try {
    s.start('Fetching projects...')
    const projects = await getUserProjects(authToken)
    s.stop('Projects fetched successfully.')

    // Display projects and let user select from name and date (in readable format)
    const projectChoices = projects.map((project: any) => {
      return {
        label: color.bold(`${project.label} - ${new Date(project.createdAt).toLocaleString()}`),
        value: project,
      }
    })

    const selectedProject = await p.select<CloneProjectOption[], CloneProjectOptionResponse>({
      message: 'Select a project to clone:',
      options: projectChoices,
    })

    // Get project details
    if (!selectedProject) {
      p.cancel('No project selected.')
    }

    let projectDetails

    if (typeof selectedProject === 'object' && selectedProject !== null) {
      if ("label" in selectedProject && "createdAt" in selectedProject) {
        s.start('Fetching project details...')
        projectDetails = await getProjectDetails(authToken, selectedProject?.label, selectedProject?.createdAt)
        s.stop('Project details fetched successfully.')
      }
    }

    // Clone project
    s.start('Cloning project...')
    project.name = projectDetails?.projectLabel

    // Create project directory
    await createHypershipProjectDirectory(project)

    // Create web directory
    await createWebDirectory(project)

    // Clone hypership framework
    await cloneHypershipFramework(project, projectDetails?.projectFramework)

    // Create hypership config
    await createHypershipConfig(projectDetails?.projectSlug, project)

    s.stop(color.green('Project cloned successfully.'))

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
      p.cancel(`${color.bgRed(color.white(' Unauthorized: '))} Your current session has expired. Please login again using ${color.underline(color.bold('hypership login'))}.`)
    }

    process.exit(1)
  }
}