import { program } from 'commander';
import * as color from 'picocolors';
import readline from 'readline';
import { Writable } from 'stream';

import { createNewProject } from './commands/new/index.js';
import { login } from './commands/login/index.js';
import { logout } from './commands/logout/index.js';
import { deployProject } from './commands/deploy/index.js';
import { cloneProject } from './commands/clone/index.js';

const muteStream = new Writable({
  write(chunk, encoding, callback) {
    callback();
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: muteStream
});

rl.on('SIGINT', () => {
  process.stdout.write(color.red('\n Hypership CLI exited.\n'));
  process.exit();
});

program
  .command('new')
  .description('Create a new Hypership project')
  .action(async () => {
    await createNewProject();
  });

program
  .command('login')
  .description('Login to Hypership')
  .option('-e, --email <email>', 'Email')
  .option('-p, --password <password>', 'Password')
  .option('-ns, --no-save', 'Do not save the password in the system keychain')
  .action(async (options) => {
    await login(options);
  });

program
  .command('logout')
  .description('Logout of Hypership')
  .action(async () => {
    await logout();
  });

program
  .command('deploy')
  .description('Deploy your Hypership project')
  .action(async () => {
    await deployProject();
  });

program
  .command('clone')
  .description('Clone your Hypership project')
  .action(async () => {
    await cloneProject();
  });

program.parse(process.argv);
