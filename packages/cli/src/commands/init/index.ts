import * as p from "@clack/prompts";
import fs from "fs";
import ora from "ora";
import color from "picocolors";

import { displayCLIHeader } from "../../util/displayCLIHeader.js";
import { checkForUpdates } from "../../util/updateNotifier.js";

import { retrieveToken } from "../../lib/retrieveToken.js";
import { getUserProjects } from "../../util/init/project.js";
import { getProjectDetails } from "../../util/projectDetails.js";
import {
  createHypershipProjectDirectory,
  createWebDirectory,
} from "../../util/init/directory.js";
import { cloneHypershipFramework } from "../../util/init/framework.js";
import { createHypershipConfig } from "../../util/init/config.js";
import { installDependencies } from "../../util/init/dependencies.js";
import { createEnvFile } from "../../util/init/createEnvFile.js";

import { CloneProjectOption, CloneProjectOptionResponse } from "../../types.js";
import {
  ERROR_MESSAGES,
  ErrorMessageKey,
} from "../../constants/errorMessages.js";

export const initProject = async (projectId: string) => {
  displayCLIHeader();

  await checkForUpdates();

  const spinner = ora();

  let project: { name: string } = { name: "" };

  try {
    spinner.start("Fetching projects");
    const authToken = await retrieveToken();

    if (!authToken) {
      throw new Error("Failed to retrieve token");
    }

    let projectDetails;

    if (projectId) {
      projectDetails = await getProjectDetails(authToken, { projectId });
      spinner.succeed("Project details fetched successfully");
    } else {
      const projects = await getUserProjects(authToken);
      spinner.succeed("Projects fetched successfully");

      // Display projects and let user select from name and date (in readable format)
      const projectChoices = projects.map((project: any) => {
        return {
          label: color.bold(
            `${project.slug} - ${new Date(project.createdAt).toLocaleString()}`
          ),
          value: project,
        };
      });

      const selectedProject = await p.select<
        CloneProjectOption[],
        CloneProjectOptionResponse
      >({
        message: "Select a project to initialize:",
        options: projectChoices,
      });

      // Get project details
      if (!selectedProject) {
        spinner.fail("No project selected");
      }

      if (typeof selectedProject === "object" && selectedProject !== null) {
        if (
          "slug" in selectedProject &&
          typeof selectedProject.slug === "string" &&
          "createdAt" in selectedProject
        ) {
          projectDetails = await getProjectDetails(authToken, {
            projectSlug: selectedProject.slug,
          });
        }
      }
    }

    // Initialize project
    spinner.start("Initializing project");
    project.name = projectDetails?.slug;

    // Create project directory
    await createHypershipProjectDirectory(project);

    // Create web directory - coming soon with API deployments
    // await createWebDirectory(project)

    // Initialize hypership framework
    await cloneHypershipFramework(
      authToken,
      project,
      projectDetails?.framework
    );

    // Create hypership config
    await createHypershipConfig(projectDetails?.id, project);

    // Create .env file
    await createEnvFile(authToken, projectDetails?.id, project);

    // Install dependencies
    await installDependencies(project);

    spinner.succeed("Project initialized successfully. \n");

    console.log(
      `Next steps:
      1. cd ${project.name}
      2. Execute ${color.bold("npm run dev")} to launch the development server`
    );
  } catch (error: unknown) {
    // Delete the directory if the app creation fails
    if (fs.existsSync(project.name)) {
      fs.rmSync(project.name, { recursive: true, force: true });
    }

    const message = error instanceof Error ? error.message : "default";

    if (spinner) {
      spinner.fail(
        ERROR_MESSAGES[message as ErrorMessageKey] || ERROR_MESSAGES.defaultInit
      );
    }

    process.exit(1);
  }
};
