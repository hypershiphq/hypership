import * as p from "@clack/prompts";
import validator from "email-validator";
import ora from "ora";

import { displayCLIHeader } from "../../util/displayCLIHeader.js";
import { checkForUpdates } from "../../util/updateNotifier.js";
import { standardLogin } from "../../util/authenticate/login.js";
import { storeTokens } from "../../util/authenticate/storeTokens.js";

import {
  ERROR_MESSAGES,
  ErrorMessageKey,
} from "../../constants/errorMessages.js";
import { cliKeyAuthentication } from "../../util/authenticate/cliKey.js";

export const authenticate = async (cliKey: string, options: any) => {
  displayCLIHeader();

  await checkForUpdates();

  const spinner = ora();

  try {
    if (cliKey) {
      spinner.start("Authenticating...");
      const accessToken = await cliKeyAuthentication(cliKey);
      storeTokens(accessToken, null);
      spinner.succeed("Authentication successful! \n");
      process.exit(0);
    }

    let email: string;
    if (!options.email) {
      email = (await p.text({
        message: "Email:",
        validate: (value) => {
          if (!value) return "Please enter an email.";
          if (!validator.validate(value))
            return "Please enter a valid email address.";
        },
      })) as string;
    } else {
      email = options.email;
    }

    let password: string | null = null;
    if (!options.password) {
      let isAuthenticated = false;
      let attemptCount = 0;

      while (!isAuthenticated && attemptCount < 3) {
        const passwordResponse = await p.password({
          message: "Password:",
          validate: (value) => {
            if (!value) return "Please enter a password.";
          },
        });
        password = passwordResponse as string;

        const user = { email, password };

        try {
          const { accessToken, refreshToken } = await standardLogin(
            user.email,
            user.password
          );

          storeTokens(accessToken, refreshToken);

          if (!accessToken) {
            throw new Error("Invalid credentials");
          }

          spinner.succeed("Authentication successful! \n");
          isAuthenticated = true;

          process.exit(0);
        } catch (error) {
          spinner.fail("Authentication failed. Please try again. \n");
          password = null;
          attemptCount++;
        }
      }

      if (!isAuthenticated) {
        spinner.fail("Failed to authenticate after several attempts. \n");
      }
    } else {
      password = options.password;

      const user = { email, password };

      spinner.start("Authenticating...");
      const { accessToken, refreshToken } = await standardLogin(
        user.email as string,
        user.password as string
      );
      storeTokens(accessToken, refreshToken);

      if (!accessToken) {
        throw new Error("Invalid credentials");
      }

      spinner.succeed("Authentication successful! \n");

      process.exit(0);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "default";

    if (spinner) {
      spinner.fail(
        ERROR_MESSAGES[message as ErrorMessageKey] ||
          ERROR_MESSAGES.defaultLogin
      );
    }

    process.exit(1);
  }
};
