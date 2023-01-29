export default {
  Query: {
    // @ts-ignore
    async allUsers(root: any, args: any, context: any) {
      return await context.prisma.user.findMany()
    }
  },
  Mutation: {
    // @ts-ignore
    async create(root: any, args: any, context: any) {
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
