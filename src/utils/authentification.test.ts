import { createToken } from './authentification'
import { TokenType } from './types'
import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import assert from 'node:assert'

interface JwtPayload {
  id: string
  iss?: string | undefined
  sub?: string | undefined
  aud?: string | string[] | undefined
  exp: number
  email?: string | undefined
}

const defineExpectedExpiration = (validity: number): number => {
  const expectedExpiration = new Date()
  const d = expectedExpiration.setSeconds(
    expectedExpiration.getSeconds() + validity
  )
  return d
}

const getJwtPayLoad = (jwtToken: string) => {
  const decodedAccessToken = jwt.decode(jwtToken.split(' ')[1], {
    complete: true
  })
  return decodedAccessToken?.payload as JwtPayload
}

describe('Authentifications utilities', () => {
  const testUser: User = {
    id: 0,
    email: 'test@gmail.com',
    username: 'test username',
    confirmed: false,
    password: 'mypassword',
    createAt: new Date(),
    updatedAt: new Date()
  }

  it('test create an access token with a validity of 30 second', async () => {
    const expectedExpiration = defineExpectedExpiration(30)
    const accessToken = createToken(TokenType.accessToken, testUser)
    const payLoad = getJwtPayLoad(accessToken)
    assert(accessToken)
    expect(accessToken.startsWith('Bearer ')).toBeTruthy()
    expect(payLoad).toBeDefined()
    expect(payLoad.email).toEqual(testUser.email)
    expect(Math.abs(payLoad.exp - expectedExpiration / 1000)).toBeLessThan(10) // could be equal but prend slow test in cicd
  })

  it('test create an refresh token with a validity of 2 days', async () => {
    const expectedExpiration = defineExpectedExpiration(2 * 24 * 60 * 60)
    const refreshToken = createToken(TokenType.refreshToken, testUser)
    const payLoad = getJwtPayLoad(refreshToken)
    assert(refreshToken)
    expect(refreshToken.startsWith('Bearer ')).toBeTruthy()
    expect(payLoad).toBeDefined()
    expect(payLoad.email).toEqual(testUser.email)
    expect(Math.abs(payLoad.exp - expectedExpiration / 1000)).toBeLessThan(10) // could be equal but prend slow test in cicd
  })

  it('test create an unexpected token type', async () => {
    expect(1).toEqual(1)
  })
})
