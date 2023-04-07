import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Tokens {
    accessToken: String!
    refreshToken: String!
  }

  type Mutation {
    "Register a new user"
    register(username: String!, email: String!, password: String!): Tokens
  }

  type Query {
    "Login method"
    login(email: String!, password: String!): Tokens
    "Refresh accessToken"
    refreshTokens(refreshToken: String!): Tokens
  }
`

export default [typeDefs]
// export default gql`
//   type Query {
//     forgotPassword(email: String!): String
//   }
//   type Mutation {
//     confirmEmail(confirmToken: String!): Tokens
//     changePassword(password: String!, forgotToken: String!): Tokens
//   }
// `
