import * as p from '@clack/prompts'
import fs from 'fs'
import path from 'path'

export const retrieveProjectConfig = (): string => {
  const configFile = path.join(process.cwd(), '.hypership', 'hypership.json')

  try {
    const data = fs.readFileSync(configFile, 'utf8')
    const parsedData = JSON.parse(data)
    return parsedData.projectSlug
  } catch (error) {
    p.cancel('Error retrieving project config. Please try again.')
    process.exit(1)
  }
}
