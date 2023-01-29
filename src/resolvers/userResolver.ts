import { Context } from '../utils/types'
interface userArgs {
  email: string
  firstname: string
  name: string
  age: number
}

export default {
  Query: {
    async allUsers(_: undefined, __: userArgs, context: Context) {
      return await context.prisma.user.findMany()
    }
  },
  Mutation: {
    async create(_: undefined, args: userArgs, context: Context) {
      const user = await context.prisma.user.create({
        data: {
          email: args.email,
          firstname: args.firstname,
          name: args.name,
          age: args.age
        }
      })
      console.log(user)
      return user
    }
  }
}
