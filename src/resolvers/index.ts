import { default as hello } from './helloResolver'
import { default as user } from './userResolver'

export default {
  Query: {
    ...hello.Query,
    ...user.Query
  },
  Mutation: {
    ...user.Mutation
  },
}
