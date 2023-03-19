import hello from './helloResolver'
import user from './userResolver'
import authentification from './authentificationResolver'

export default {
  Query: {
    ...hello.Query,
    ...user.Query,
    ...authentification.Query
  },
  Mutation: {
    ...authentification.Mutation
  }
}
