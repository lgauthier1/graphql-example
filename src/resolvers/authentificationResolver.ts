import {
  createToken,
  comparePassword,
  verifyToken
} from '../utils/authentification'
import {
  RegisterInput,
  LoginInput,
  TokenType,
  Context,
  Tokens,
  DecodedToken,
  refreshTokensInput
} from '../utils/types'
import { User } from '@prisma/client'
import { createUser, getUserByEmail } from '../services/user'
import { AuthenticationError, ForbiddenError } from 'apollo-server-express'

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
      if (!args.email || !args.password)
        throw new AuthenticationError('wrong_email_or_password')
      const user: User | null = await getUserByEmail(context.prisma, args.email)
      if (!user) throw new AuthenticationError('wrong_email_or_password')
      await comparePassword(args.password, user.password)
      const accessToken: string = createToken(TokenType.accessToken, user)
      const refreshToken: string = createToken(TokenType.refreshToken, user)
      return { accessToken, refreshToken }
    },
    async refreshTokens(
      _parent: undefined,
      args: refreshTokensInput,
      context: Context
    ): Promise<Tokens> {
      const decodedToken: DecodedToken = verifyToken(
        TokenType.refreshToken,
        args.refreshToken
      )
      const user: User | null = await getUserByEmail(
        context.prisma,
        decodedToken.email
      )
      if (!user) throw new ForbiddenError('refreshToken_invalid')
      const accessToken: string = createToken(TokenType.accessToken, user)
      const refreshToken: string = createToken(TokenType.refreshToken, user)
      return { accessToken, refreshToken }
    }
  }
}
