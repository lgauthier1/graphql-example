import { rule } from 'graphql-shield'

// @ts-ignore
export const isAdmin = rule({ cache: false })(
  // @ts-ignore
  async (parent, args, ctx: Context, info) => {
    if (ctx.role === 'admin') return true
    return false
  }
)
