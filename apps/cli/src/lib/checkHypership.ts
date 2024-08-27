import * as p from '@clack/prompts'
import fs from 'fs'
import path from 'path'
import * as color from 'picocolors';

export const checkIfHypershipProject = async (hypershipConfigFilePath: string) => {
  path.join(process.cwd(), '.hypership', 'hypership.json')
  if (!fs.existsSync(hypershipConfigFilePath)) {
    p.cancel(`${color.bgRed(color.white(' Error: '))} This command needs to be executed from the root of a hypership project. Please navigate to a hypership project directory.`)
    process.exit(1)
  }
}