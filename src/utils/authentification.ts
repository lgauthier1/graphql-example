import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { TokenType } from './types'

// TODO LOG WARNING MISSING SECRET IN .ENV
const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || 'defaultUnsecuredAccessTokenSecret'
const refreshTokenSecret =
  process.env.refreshTokenSecret || 'defaultUnsecuredRefreshTokenSecret'

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
