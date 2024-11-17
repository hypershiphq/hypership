import color from 'picocolors'

export const ERROR_MESSAGES = {
  'Unauthorized': `${color.bgRed(color.white(' Unauthorized: '))} Your current session has expired. Please login again using ${color.underline(color.bold('`hypership login`'))}.`,
  'No projects found': `${color.bgYellow(color.black(' Info: '))} No projects found. Create a project at ${color.underline('https://hypership.dev')}`,
  'Failed to fetch project details': `${color.bgRed(color.white(' Error: '))} Project not found. Please try again.`,
  'defaultLogin': `${color.red('Error logging in. Please try again.')}`,
  'defaultLogout': `${color.red('Error logging out. Please try again.')}`,
  'defaultInit': `${color.red('Error creating new Hypership app. Please try again.')}`
} as const

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES 