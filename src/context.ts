import { Context } from './utils/types'
import { prisma } from './prisma'
import { getContextWithAuth } from './utils/authentification'

export async function createContext(req: Context) {
  return await getContextWithAuth({
    ...req,
    prisma
  })
}
