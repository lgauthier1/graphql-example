import { shield } from 'graphql-shield'
import { isAuthenticad, isPublic } from './rules'

export const permissions = shield({
  Query: {
    '*': isAuthenticad,
    login: isPublic
  },
  Mutation: {
    '*': isAuthenticad,
    register: isPublic
  }
})
