import { RegisterInput } from '../utils/types'
import { PrismaClient } from '@prisma/client'

export const createUser = async (
  prisma: PrismaClient,
  userRegister: RegisterInput
) => {
  const user = await prisma.user.create({
    data: {
      email: userRegister.email,
      username: userRegister.username,
      password: userRegister.password // todo crypt
    }
  })
  return user
}
