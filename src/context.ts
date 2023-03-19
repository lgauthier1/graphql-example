import { Context } from './utils/types'
import { prisma } from './prisma'

export async function createContext({ req }: Context) {
  const role = req?.headers?.admin ? 'admin' : 'user'
  return {
    ...req,
    prisma,
    role
  }
}
