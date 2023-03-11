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
`

export default [typeDefs]
// export default gql`
//   type Tokens {
//     accessToken: String!
//     refreshToken: String!
//   }
//   type Query {
//     login(email: String!, password: String!): Tokens
//     refreshTokens(refreshToken: String!): Tokens
//     forgotPassword(email: String!): String
//   }
//   type Mutation {
//     register(username: String!, email: String!, password: String!): Tokens
//     confirmEmail(confirmToken: String!): Tokens
//     changePassword(password: String!, forgotToken: String!): Tokens
//   }
// `
