import { Context } from '../utils/types'

export default {
  Query: {
    async allUsers(_: undefined, __: undefined, context: Context) {
      return await context.prisma.user.findMany()
    }
  }
}
