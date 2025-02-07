import color from "picocolors";

export const ERROR_MESSAGES = {
  "Unauthorized": color.red(`Unauthorized - Your current session has expired. Please login again using ${color.bold("hypership authenticate")}.`),
  "No projects found": "No Hypership project found. Make sure you are in the root directory of a Hypership project.",
  "Failed to fetch project details": color.red("Project not found. Please try again."),
  "Failed to retrieve token": color.red(`Unauthorized - Your current session has expired. Please login again using ${color.bold("hypership authenticate")}.`),
  "Failed to build the project": color.red(`Project build failed. Verify that ${color.bold("npm run build")} executes without errors.`),
  "Failed to deploy static website": color.red("Failed to deploy static website. Please try again."),
  defaultLogin: color.red("Error logging in. Please try again."),
  defaultLogout: color.red("Error logging out. Please try again."),
  defaultInit: color.red("Error creating new Hypership app. Please try again."),
  defaultDeploy: color.red("Error deploying Hypership app. Please try again."),
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
