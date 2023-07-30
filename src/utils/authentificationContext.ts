import jwt from 'jsonwebtoken'
import { DecodedToken, Context } from './types'
import { AuthenticationError } from 'apollo-server-express'
import { getUserByEmail } from '../services/user'
import { accessTokenSecret } from './authentification'

export const getContextWithAuth = async (
  context: Context
): Promise<Context> => {
  const accessToken = context.req.headers.authorization || ''
  if (!accessToken) return context
  try {
    const decodedToken = jwt.verify(
      accessToken.split(' ')[1],
      accessTokenSecret
    ) as DecodedToken
    const user = await getUserByEmail(context.prisma, decodedToken.email)
    if (user === null) return { ...context }
    return { ...context, user }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('accessToken_expired')
    }
    return { ...context }
  }
}
