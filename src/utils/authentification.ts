import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { TokenType } from './types'
import { AuthenticationError } from 'apollo-server-express'
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
