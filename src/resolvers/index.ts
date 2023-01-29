import hello from './helloResolver'
import user from './userResolver'

export default {
  Query: {
    ...hello.Query,
    ...user.Query
  },
  Mutation: {
    ...user.Mutation
  }
}
