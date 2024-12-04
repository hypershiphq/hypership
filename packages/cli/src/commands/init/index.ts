import * as p from '@clack/prompts'
import fs from 'fs'
import color = require('picocolors')

import { retrieveToken } from '../../lib/retrieveToken.js'
import { getUserProjects } from '../../util/init/project.js'
import { getProjectDetails } from '../../util/projectDetails.js'
import { createHypershipProjectDirectory, createWebDirectory } from '../../util/init/directory.js'
import { cloneHypershipFramework } from '../../util/init/framework.js'
import { createHypershipConfig } from '../../util/init/config.js'
import { installDependencies } from '../../util/init/dependencies.js'
import { CloneProjectOption, CloneProjectOptionResponse } from '../../types.js'
import { ERROR_MESSAGES, ErrorMessageKey } from '../../constants/errorMessages.js'

export const initProject = async (projectId: string) => {
  console.clear()

  // Initial check spinner
  let s = p.spinner()

  p.intro(color.bgCyan(color.black(' 🚀 Initialize Hypership App ')))

  const authToken = retrieveToken()

  let project: { name: string } = { name: '' }

  try {
    let projectDetails

    if (projectId) {
      s.start('Fetching project details...')
      projectDetails = await getProjectDetails(authToken, { projectId })
      s.stop('Project details fetched successfully.')
    } else {
      s.start('Fetching projects...')
      const projects = await getUserProjects(authToken)
      s.stop('Projects fetched successfully.')

      // Display projects and let user select from name and date (in readable format)
      const projectChoices = projects.map((project: any) => {
        return {
          label: color.bold(`${project.slug} - ${new Date(project.createdAt).toLocaleString()}`),
          value: project,
        }
      })

      const selectedProject = await p.select<CloneProjectOption[], CloneProjectOptionResponse>({
        message: 'Select a project to initialize:',
        options: projectChoices,
      })

      // Get project details
      if (!selectedProject) {
        p.cancel('No project selected.')
      }

      if (typeof selectedProject === 'object' && selectedProject !== null) {
        if ("slug" in selectedProject && typeof selectedProject.slug === 'string' && "createdAt" in selectedProject) {
          s.start('Fetching project details...');
      
          projectDetails = await getProjectDetails(authToken, { projectSlug: selectedProject.slug })
      
          s.stop('Project details fetched successfully.');
        }
      }
    }

    // Initialize project
    s.start('Initializing project...')
    project.name = projectDetails?.slug

    // Create project directory
    await createHypershipProjectDirectory(project)

    // Create web directory - coming soon with API deployments
    // await createWebDirectory(project)

    // Initialize hypership framework
    await cloneHypershipFramework(authToken, project, projectDetails?.framework)

    // Create hypership config
    await createHypershipConfig(projectDetails?.id, project)

    // Install dependencies
    await installDependencies(project)

    s.stop(color.bgGreen(color.black('Project initialized successfully.')))

    p.outro(
      `Next steps: 
      1. cd ${project.name}
      2. Run npm run start to start the development server`
    )

  } catch (error: unknown) {
    // Delete the directory if the app creation fails
    if (fs.existsSync(project.name)) {
      fs.rmSync(project.name, { recursive: true, force: true })
    }

    const message = error instanceof Error ? error.message : 'default'

    if (s) {
      s.stop(ERROR_MESSAGES[message as ErrorMessageKey] || ERROR_MESSAGES.defaultInit)
    } else {
      p.cancel(ERROR_MESSAGES[message as ErrorMessageKey] || ERROR_MESSAGES.defaultInit)
    }

    process.exit(1)
  }
}