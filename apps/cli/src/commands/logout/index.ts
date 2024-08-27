import * as p from '@clack/prompts'
import color = require('picocolors')

import {
  deleteStoredPassword,
  deleteStoredToken
} from './utils.js'

export const logout = async () => {
  console.clear()

  try {

    p.intro(`${color.bgCyan(color.black(' 🚀 Hypership Logout '))}`)
  
    await deleteStoredPassword()
    await deleteStoredToken()
  
    p.outro('You have been logged out.')
  
    process.exit(0)
  } catch (error) {
    p.cancel('An error occurred while logging out. Please try again.')
    process.exit(1)
  }
}
