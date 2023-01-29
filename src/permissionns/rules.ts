import { rule } from 'graphql-shield'
import { Context } from '../utils/types'

export const isAdmin = rule({ cache: false })(
  async (_parent: undefined, _args, ctx: Context) => {
    if (ctx.role === 'admin') return true
    return false
  }
)
