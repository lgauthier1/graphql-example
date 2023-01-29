import { PrismaClient } from '@prisma/client'
import { Context } from './utils/types'

const prisma = new PrismaClient()

export async function createContext({ req }: Context) {
  const role = req?.headers?.admin ? 'admin' : 'user'
  return {
    ...req,
    prisma,
    role
  }
}
