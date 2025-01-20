import ora from "ora";

import { displayCLIHeader } from "../../util/displayCLIHeader.js";
import { checkForUpdates } from "../../util/updateNotifier.js";

import { deleteStoredToken } from "../../util/logout/deleteToken.js";

import {
  ERROR_MESSAGES,
  ErrorMessageKey,
} from "../../constants/errorMessages.js";

export const logout = async () => {
  displayCLIHeader();

  checkForUpdates();

  const spinner = ora();
  try {
    spinner.start("Logging out...");
    await deleteStoredToken();

    spinner.succeed("You have been logged out. \n");

    process.exit(0);
  } catch (error) {
    const message = error instanceof Error ? error.message : "default";

    if (spinner) {
      spinner.fail(
        ERROR_MESSAGES[message as ErrorMessageKey] ||
          ERROR_MESSAGES.defaultLogout
      );
    }

    process.exit(1);
  }
};
