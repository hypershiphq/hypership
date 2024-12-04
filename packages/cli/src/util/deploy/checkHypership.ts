import fs from 'fs'
import path from 'path'

export const checkIfHypershipProject = async (hypershipConfigFilePath: string) => {
  try {
    path.join(process.cwd(), '.hypership', 'hypership.json')

    if (!fs.existsSync(hypershipConfigFilePath)) {
      throw new Error('Failed to check if Hypership project')
    }
  } catch (error) {
    throw new Error('Failed to check if Hypership project')
  }
}