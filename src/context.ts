import { PrismaClient } from '@prisma/client'
import { Context } from './utils/types'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended' // require for tests

const prisma = new PrismaClient()

export async function createContext({ req }: Context) {
  const role = req?.headers?.admin ? 'admin' : 'user'
  return {
    ...req,
    prisma,
    role
  }
}

// require for tests
export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>
}

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>()
  }
}
