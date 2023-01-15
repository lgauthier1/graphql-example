import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export interface Context {
  prisma: PrismaClient
  req: any // HTTP request carrying the `Authorization` header
}

export async function createContext(req: any) {
  return {
    ...req,
    prisma,
  }
}
