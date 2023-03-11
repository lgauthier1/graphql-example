import { createToken } from './authentification'
import { TokenType } from './types'
import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import assert from 'node:assert'

interface JwtPayload {
  [key: string]: any
  id: string
  iss?: string | undefined
  sub?: string | undefined
  aud?: string | string[] | undefined
  exp: number
  email?: string | undefined
}

describe('Authentifications utilities', () => {
  it('test create an access token', async () => {
    const testUser: User = {
      id: 0,
      email: 'test@gmail.com',
      username: 'test username',
      confirmed: false,
      password: 'mypassword',
      createAt: new Date(),
      updatedAt: new Date()
    }
    const accessToken = createToken(TokenType.accessToken, testUser)
    const decodedAccessToken = jwt.decode(accessToken.split(' ')[1], {
      complete: true
    })
    const payLoad = decodedAccessToken?.payload as JwtPayload
    console.log(payLoad)
    console.log(new Date(payLoad.exp))
    assert(accessToken)
    expect(accessToken.startsWith('Bearer ')).toBeTruthy()
    assert(decodedAccessToken)
    expect(payLoad).toBeDefined()
    expect(payLoad.email).toEqual(testUser.email)
  })

  it('test create an refresh token', async () => {
    expect(1).toEqual(1)
  })

  it('test create an unexpected token type', async () => {
    expect(1).toEqual(1)
  })
})
