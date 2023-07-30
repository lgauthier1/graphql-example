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

export const getUserByEmail = async (prisma: PrismaClient, email: string) => {
  return await prisma.user.findUnique({
    where: { email }
  })
}

export const updateUserPassword = async (
  prisma: PrismaClient,
  id: number,
  password: string
) => {
  return await prisma.user.update({
    where: { id },
    data: {
      password: hashPassword(password)
    }
  })
}
