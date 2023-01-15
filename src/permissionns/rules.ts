import { rule } from 'graphql-shield'

// @ts-ignore
export const isAdmin = rule({ cache: false })(
  // @ts-ignore
  async (parent, args, ctx: Context, info) => {
    console.log('role', ctx.role)
    // console.log(ctx.request.get('Authorization'))
    // console.log('SHIELD: IsGrocer?')
    if(ctx.role === 'admin') return true
    return true
  },
)
