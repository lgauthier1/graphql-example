import { Request, Response } from 'express'
import { PrismaClient, User } from '@prisma/client'

export type Context = {
  req: Request
  res?: Response
  prisma: PrismaClient
  user?: User
  role?: string
}

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  email: string
  username: string
  password: string
}

export enum TokenType {
  accessToken,
  refreshToken,
  unknown
}

export type Tokens = {
  accessToken: string
  refreshToken: string
}

export type DecodedToken = {
  email: string
  iat: number
  exp: number
}
