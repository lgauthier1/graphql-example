import { createToken, comparePassword } from '../utils/authentification'
import {
  RegisterInput,
  LoginInput,
  TokenType,
  Context,
  Tokens
} from '../utils/types'
import { User } from '@prisma/client'
import { createUser } from '../services/user'
import { AuthenticationError } from 'apollo-server-express'

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
  },
  Query: {
    async login(
      _parent: undefined,
      args: LoginInput,
      context: Context
    ): Promise<Tokens> {
      const user: User | null = await context.prisma.user.findUnique({
        where: { email: args.email }
      })
      if (!user) throw new AuthenticationError('wrong_email_or_password')
      await comparePassword(args.password, user.password)
      const accessToken: string = createToken(TokenType.accessToken, user)
      const refreshToken: string = createToken(TokenType.refreshToken, user)
      return { accessToken, refreshToken }
    }
  }
}
