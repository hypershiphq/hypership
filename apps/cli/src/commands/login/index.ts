import * as p from '@clack/prompts'
import validator from 'email-validator'
import color = require('picocolors')

import {
  checkKeychainCompatibility,
  deleteStoredPassword,
  getPasswordFromKeychain,
  signIn,
  storePassword,
  storeToken
} from './utils.js'

export const login = async (options: any) => {
  console.clear()
  
  try {
    p.intro(`${color.bgCyan(color.black(' 🚀 Hypership Login '))}`)

    let email: string
    if (!options.email) {
      email = await p.text({
        message: 'Email:',
        validate: (value) => {
          if (!value) return 'Please enter an email.'
          // Check for valid email format
          if (!validator.validate(value)) return 'Please enter a valid email address.'
        },
      }) as string
    } else {
      email = options.email
    }

    let password: string | null = await getPasswordFromKeychain(email)
    if (!options.password) {
      let isAuthenticated = false
      let attemptCount = 0

      while (!isAuthenticated && attemptCount < 3) {
        if (!password) {
          const passwordResponse = await p.password({
            message: 'Password:',
            validate: (value) => {
              if (!value) return 'Please enter a password.'
            },
          })
          password = passwordResponse as string
        } else {
          p.note('Password retrieved from keychain.')
        }

        const user = { email, password }

        try {
          const accessToken = await signIn(user.email, user.password)
          storeToken(accessToken)

          if (!accessToken) {
            throw new Error('Invalid credentials')
          }

          if (!await getPasswordFromKeychain(email) || attemptCount > 0) {
            const isCompatible = await checkKeychainCompatibility()
            if (isCompatible && options.save !== false) {
              const storePasswordChoice = await p.confirm({
                message: 'Do you want to save your password securely in your system\'s keychain?',
              })

              if (storePasswordChoice) {
                await storePassword(user.email, user.password)
              } else {
                await deleteStoredPassword(user.email)
              }
            }
          }

          p.outro(color.bgGreen(color.black('Login successful!')))
          isAuthenticated = true
        } catch (error) {
          p.cancel(`${color.bgRed(color.white('Authentication failed.'))} Please try again.`)
          password = null
          attemptCount++
        }
      }

      if (!isAuthenticated) {
        p.cancel('Failed to authenticate after several attempts.')
      }
    } else {
      password = options.password

      const user = { email, password }

      try {
        const s = p.spinner()
        s.start('Authenticating...')
        const accessToken = await signIn(user.email as string, user.password as string)
        storeToken(accessToken)

        if (!accessToken) {
          throw new Error('Invalid credentials')
        }

        s.stop(color.bgGreen(color.black('Login successful!')))
      } catch (error) {
        p.cancel(`${color.bgRed(color.white('Authentication failed.'))} Please try again.`)
      }
    }
  } catch (error) {
    p.cancel('An error occurred while logging in. Please try again.')
    process.exit(1)
  }
}
