import { rule } from 'graphql-shield'
import { Context } from '../utils/types'

export const isPublic = rule({ cache: 'contextual' })(async () => {
  console.log('IS PULIC')
  return true
})

export const isAuthenticad = rule({ cache: 'contextual' })(
  async (_: undefined, __: undefined, context: Context) => {
    return !!context.user
  }
)
