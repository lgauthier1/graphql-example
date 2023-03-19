import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { TokenType, DecodedToken, Context } from './types'
import { AuthenticationError } from 'apollo-server-express'
import { getUserByEmail } from '../services/user'
import bcrypt from 'bcrypt'

// TODO LOG WARNING MISSING SECRET IN .ENV
const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || 'defaultUnsecuredAccessTokenSecret'
const refreshTokenSecret =
  process.env.refreshTokenSecret || 'defaultUnsecuredRefreshTokenSecret'

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 12)
}

export const comparePassword = (
  password: string,
  hashedPassword: string
): boolean | void => {
  const result = bcrypt.compareSync(password, hashedPassword)
  if (!result) throw new AuthenticationError('wrong_email_password')
  return result
}

export const createToken = (tokenType: TokenType, user: User): string => {
  switch (tokenType) {
    case TokenType.accessToken:
      return (
        'Bearer ' +
        jwt.sign({ email: user.email }, accessTokenSecret, {
          expiresIn: '30s'
        })
      )
    case TokenType.refreshToken:
      return (
        'Bearer ' +
        jwt.sign({ email: user.email }, refreshTokenSecret, {
          expiresIn: '2d'
        })
      )
    default:
      throw new Error('Unknow_TokenType')
  }
}

export const getContextWithAuth = async (
  context: Context
): Promise<Context> => {
  const accessToken = context.req.headers.authorization || ''
  if (!accessToken) return context
  try {
    const decodedToken = jwt.verify(
      accessToken.split(' ')[1],
      accessTokenSecret
    ) as DecodedToken
    console.log(decodedToken)
    const user = await getUserByEmail(context.prisma, decodedToken.email)
    if (user === null) return { ...context }
    return { ...context, user }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('accessToken_expired')
    }
    return { ...context }
  }
}
