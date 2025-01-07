import * as p from '@clack/prompts'
import color from 'picocolors'

import { deleteStoredPassword } from '../../util/logout/keychain.js'
import { deleteStoredToken } from '../../util/logout/deleteToken.js'

import { ERROR_MESSAGES, ErrorMessageKey } from '../../constants/errorMessages.js'

export const logout = async () => {
  console.clear()

  try {
    p.intro(`${color.bgCyan(color.black(' 🚀 Hypership Logout '))}`)
  
    await deleteStoredPassword()
    await deleteStoredToken()
  
    p.outro('You have been logged out.')
  
    process.exit(0)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'default'

    p.cancel(ERROR_MESSAGES[message as ErrorMessageKey] || ERROR_MESSAGES.defaultLogout)

    process.exit(1)
  }
}
