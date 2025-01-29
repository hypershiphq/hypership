import { setTimeout } from "node:timers/promises";
import path from "path";
import ora from "ora";

import { displayCLIHeader } from "../../util/displayCLIHeader.js";
import { checkForUpdates } from "../../util/updateNotifier.js";

import { retrieveToken } from "../../lib/retrieveToken.js";
import { retrieveProjectConfig } from "../../util/deploy/projectConfig.js";
import { getProjectDetails } from "../../util/projectDetails.js";
import { checkIfHypershipProject } from "../../util/deploy/checkHypership.js";
import { getUploadLink } from "../../util/deploy/upload.js";
import { deployStaticWebsite } from "../../util/deploy/staticWebsite.js";
import { log } from "../../util/deploy/log.js";

import {
  ERROR_MESSAGES,
  ErrorMessageKey,
} from "../../constants/errorMessages.js";

export const deployProject = async () => {
  displayCLIHeader();

  await checkForUpdates();

  const spinner = ora();
  spinner.start("Installing dependencies");

  // Check if the current directory is a Hypership project
  try {
    await checkIfHypershipProject(
      path.join(process.cwd(), ".hypership", "hypership.json")
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "default";
    spinner.warn(ERROR_MESSAGES[message as ErrorMessageKey]);
    process.exit(1);
  }

  let authToken: string | undefined;
  let projectId: string | undefined;
  let deploymentId: string | undefined;
  try {
    authToken = await retrieveToken();
    projectId = await retrieveProjectConfig();
    const projectDetails = await getProjectDetails(authToken, { projectId });

    // Log deployment
    deploymentId = await log(
      authToken,
      "building",
      "Building static website...",
      "",
      projectId
    );

    const preSignedUrl = await getUploadLink(
      authToken,
      projectId,
      deploymentId
    );

    // Deploy static website
    await deployStaticWebsite(
      preSignedUrl,
      deploymentId,
      projectDetails?.framework,
      spinner
    );

    await setTimeout(1000);
    spinner.succeed("Hypership Project Deployed");
    console.log(
      `\n🔗 Your Hypership Project: \nhttps://${projectDetails?.slug}.hypership.dev \n`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "default";

    if (authToken && projectId && deploymentId) {
      await log(authToken, "failed", message, deploymentId, projectId);
    }

    if (spinner) {
      if (message === "No projects found") {
        spinner.warn(ERROR_MESSAGES[message as ErrorMessageKey]);
      } else {
        spinner.fail(
          ERROR_MESSAGES[message as ErrorMessageKey] ||
            ERROR_MESSAGES.defaultDeploy
        );
      }
    }

    process.exit(1);
  }
};
