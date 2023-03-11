import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { TokenType } from './types'

export const createToken = (tokenType: TokenType, user: User): string => {
  switch (tokenType) {
    case TokenType.accessToken:
      return (
        'Bearer ' +
        jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET!, {
          expiresIn: '30s'
        })
      )
    case TokenType.refreshToken:
      return (
        'Bearer ' +
        jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET!, {
          expiresIn: '2d'
        })
      )
    default:
      throw new Error('Unknow_TokenType')
  }
}
