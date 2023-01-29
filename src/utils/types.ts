import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

export type Context = {
  req: Request
  res: Response
  prisma: PrismaClient
  role: string
}
