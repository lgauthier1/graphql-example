import { rule } from 'graphql-shield'
import { Context } from '../utils/types'

export const isAdmin = rule({ cache: false })(
  async (_parent: undefined, _args, ctx: Context) => {
    console.log(ctx)
    return true
    // if (ctx.role === 'admin') return true
    // return false
  }
)
