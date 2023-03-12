import { createToken } from '../utils/authentification'
import { RegisterInput, TokenType, Context, Tokens } from '../utils/types'
import { createUser } from '../services/user'

export default {
  Mutation: {
    async register(
      _parent: undefined,
      args: RegisterInput,
      context: Context
    ): Promise<Tokens> {
      const user = await createUser(context.prisma, args)
      const accessToken: string = createToken(TokenType.accessToken, user)
      const refreshToken: string = createToken(TokenType.refreshToken, user)
      return { accessToken, refreshToken }
    }
  }
}
