import { RegisterInput } from '../utils/types'
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../utils/authentification'

export const createUser = async (
  prisma: PrismaClient,
  userRegister: RegisterInput
) => {
  const user = await prisma.user.create({
    data: {
      email: userRegister.email,
      username: userRegister.username,
      password: hashPassword(userRegister.password)
    }
  })
  return user
}
