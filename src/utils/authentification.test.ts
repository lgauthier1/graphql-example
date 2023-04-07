import {
  createToken,
  hashPassword,
  comparePassword,
  verifyToken
} from './authentification'
import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import { TokenType } from './types'
import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import assert from 'node:assert'

interface JwtPayload {
  exp: number
  email?: string | undefined
}

const testUser: User = {
  id: 0,
  email: 'test@gmail.com',
  username: 'test username',
  confirmed: false,
  password: 'mypassword',
  createAt: new Date(),
  updatedAt: new Date()
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

describe('UTILS: Authentifications utilities', () => {
  it('create an access token with a validity of 30 second', async () => {
    const expectedExpiration = defineExpectedExpiration(30)
    const accessToken = createToken(TokenType.accessToken, testUser)
    const payLoad = getJwtPayLoad(accessToken)
    assert(accessToken)
    expect(accessToken.startsWith('Bearer ')).toBeTruthy()
    expect(payLoad).toBeDefined()
    expect(payLoad.email).toEqual(testUser.email)
    expect(Math.abs(payLoad.exp - expectedExpiration / 1000)).toBeLessThan(10) // could be equal but prend slow test in cicd
  })

  it('create a refresh token with a validity of 2 days', async () => {
    const expectedExpiration = defineExpectedExpiration(2 * 24 * 60 * 60)
    const refreshToken = createToken(TokenType.refreshToken, testUser)
    const payLoad = getJwtPayLoad(refreshToken)
    assert(refreshToken)
    expect(refreshToken.startsWith('Bearer ')).toBeTruthy()
    expect(payLoad).toBeDefined()
    expect(payLoad.email).toEqual(testUser.email)
    expect(Math.abs(payLoad.exp - expectedExpiration / 1000)).toBeLessThan(10) // could be equal but prend slow test in cicd
  })

  it('create an unknown tokentype', async () => {
    // to increase test coverage
    expect(() => createToken(TokenType.unknown, testUser)).toThrow(
      'Unknow_TokenType'
    )
  })

  it('hash a password and compare it with the good value', () => {
    const plainPassword = 'mysecretpassword'
    const hased = hashPassword(plainPassword)
    const isEqual = comparePassword(plainPassword, hased)
    expect(isEqual).toBeTruthy()
  })

  it('hash a password and compare it with the wrong value to throw AuthenticationError', () => {
    const plainPassword = 'mysecretpassword'
    const hased = hashPassword(plainPassword)

    expect(() => comparePassword('wrongPasswoard', hased)).toThrow(
      AuthenticationError
    )
    expect(() => comparePassword('wrongPasswoard', hased)).toThrow(
      'wrong_email_password'
    )
  })

  it('verify a valid acesstoken', () => {
    const accessToken = createToken(TokenType.accessToken, testUser)
    const decodedToken = verifyToken(TokenType.accessToken, accessToken)
    assert(decodedToken)
    expect(decodedToken.email).toBe(testUser.email)
  })

  it('verify an expired acesstoken', async () => {
    const accessToken =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjc5MjQ4MDc2LCJleHAiOjE2NzkyNDgxMDZ9.WGKLfvHO_mULJ82N_F_x2Lecf1nUOkzlRPO1uETxi2g'
    expect(() => verifyToken(TokenType.accessToken, accessToken)).toThrow(
      ForbiddenError
    )
    expect(() => verifyToken(TokenType.accessToken, accessToken)).toThrow(
      'accessToken_expired'
    )
  })

  it('verify an invalid acesstoken', async () => {
    const accessToken =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjMjQ4MDc2LCJleHAiOjE2NzkyNDgxMDZ9.WGKLfvHO_mULJ82N_F_x2Lecf1nUOkzlRPO1uETxi2g'
    expect(() => verifyToken(TokenType.accessToken, accessToken)).toThrow(
      ForbiddenError
    )
    expect(() => verifyToken(TokenType.accessToken, accessToken)).toThrow(
      'accessToken_invalid'
    )
  })

  it('verify a valid refreshtoken', () => {
    const refreshToken = createToken(TokenType.refreshToken, testUser, '1s')
    const decodedToken = verifyToken(TokenType.refreshToken, refreshToken)
    assert(decodedToken)
    expect(decodedToken.email).toBe(testUser.email)
  })

  it('verify an expired refreshtoken', async () => {
    const refreshToken =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNjc5MjQ4NTA0LCJleHAiOjE2NzkyNDg1MDV9._A14WBAp0WHqY_7JNU6wiXuwK_su9tKNkZLSQ8d8vtk'
    expect(() => verifyToken(TokenType.refreshToken, refreshToken)).toThrow(
      ForbiddenError
    )
    expect(() => verifyToken(TokenType.refreshToken, refreshToken)).toThrow(
      'refreshToken_expired'
    )
  })

  it('verify an invalid refreshtoken', async () => {
    const refreshToken =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuYtIiwiaWF0IjoxNjc5MjQ4NTA0LCJleHAiOjE2NzkyNDg1MDV9._A14WBAp0WHqY_7JNU6wiXuwK_su9tKNkZLSQ8d8vtk'
    expect(() => verifyToken(TokenType.refreshToken, refreshToken)).toThrow(
      ForbiddenError
    )
    expect(() => verifyToken(TokenType.refreshToken, refreshToken)).toThrow(
      'refreshToken_invalid'
    )
  })

  it('verify an unknown token', async () => {
    // for coverage
    const unknown =
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuYtIiwiaWF0IjoxNjc5MjQ4NTA0LCJleHAiOjE2NzkyNDg1MDV9._A14WBAp0WHqY_7JNU6wiXuwK_su9tKNkZLSQ8d8vtk'
    expect(() => verifyToken(TokenType.unknown, unknown)).toThrow(
      ForbiddenError
    )
    expect(() => verifyToken(TokenType.unknown, unknown)).toThrow(
      'unknown_invalid'
    )
  })
})
