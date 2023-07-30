import { Context } from './utils/types'
import { prisma } from './prisma'
import { getContextWithAuth } from './utils/authentificationContext'

export async function createContext(req: Context) {
  return await getContextWithAuth({
    ...req,
    prisma
  })
}
