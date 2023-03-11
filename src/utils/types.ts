import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export type Context = {
  req: Request
  res: Response
  prisma: PrismaClient
  role: string
}

export type RegisterInput = {
  email: string
  username: string
  password: string
}

export enum TokenType {
  accessToken,
  refreshToken
}

export type Tokens = {
  accessToken: string
  refreshToken: string
}
