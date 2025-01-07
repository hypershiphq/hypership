import { program } from 'commander';
import color from 'picocolors';
import * as readline from 'readline';
import { Writable } from 'stream';

import { authenticate } from './commands/authenticate/index.js';
import { logout } from './commands/logout/index.js';
import { deployProject } from './commands/deploy/index.js';
import { initProject } from './commands/init/index.js';

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
  .name('hypership')
  .description('CLI for Hypership platform')
  .version('1.0.0');

program
  .command('authenticate [cliKey]')
  .description('Authenticate with Hypership')
  .option('-e, --email <email>', 'Email')
  .option('-p, --password <password>', 'Password')
  .option('-ns, --no-save', 'Do not save the password in the system keychain')
  .action(async (cliKey: string, options) => {
    await authenticate(cliKey, options);
  });

program
  .command('logout')
  .description('Logout of Hypership')
  .action(async () => {
    await logout();
  });

program
  .command('init [projectId]')
  .description('Initialize your Hypership project')
  .action(async (projectId: string) => {
    await initProject(projectId);
  });

program
  .command('deploy')
  .description('Deploy your Hypership project')
  .action(async () => {
    await deployProject();
  });

program.parse(process.argv);
