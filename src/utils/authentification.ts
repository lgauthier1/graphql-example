import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { TokenType, DecodedToken } from './types'
import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import bcrypt from 'bcrypt'

// TODO LOG WARNING MISSING SECRET IN .ENV
export const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || 'defaultUnsecuredAccessTokenSecret'
export const refreshTokenSecret =
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

export const createToken = (
  tokenType: TokenType,
  user: User,
  expired?: string
): string => {
  switch (tokenType) {
    case TokenType.accessToken:
      return (
        'Bearer ' +
        jwt.sign({ email: user.email }, accessTokenSecret, {
          expiresIn: expired || '30s'
        })
      )
    case TokenType.refreshToken:
      return (
        'Bearer ' +
        jwt.sign({ email: user.email }, refreshTokenSecret, {
          expiresIn: expired || '2d'
        })
      )
    default:
      throw new Error('Unknow_TokenType')
  }
}

export const verifyToken = (tokenType: TokenType, token: string) => {
  token = token.split(' ')[1]
  try {
    switch (tokenType) {
      case TokenType.accessToken:
        return jwt.verify(token, accessTokenSecret) as DecodedToken
      case TokenType.refreshToken:
        return jwt.verify(token, refreshTokenSecret) as DecodedToken
      default:
        throw new Error('Unknow_TokenType')
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ForbiddenError(`${TokenType[tokenType]}_expired`)
    } else {
      throw new ForbiddenError(`${TokenType[tokenType]}_invalid`)
    }
  }
}
