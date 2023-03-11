import { createToken } from '../utils/authentification'
import { RegisterInput, TokenType, Context, Tokens } from '../utils/types'

export default {
  Mutation: {
    async register(
      _parent: undefined,
      args: RegisterInput,
      context: Context
    ): Promise<Tokens> {
      const user = await context.prisma.user.create({
        data: {
          email: args.email,
          username: args.username,
          password: args.password
        }
      })
      const accessToken: string = createToken(TokenType.accessToken, user)
      const refreshToken: string = createToken(TokenType.refreshToken, user)
      return { accessToken, refreshToken }
    }
  }
}
