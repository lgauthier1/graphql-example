const typeDefs = `#graphql
  scalar Date
  type User{
    id: Int 
    email: String
    username: String
    confirmed: Boolean 
    password:  String
    createAt:  Date
    updatedAt: Date
  }
  type Query {
    "List all Users (admin only)"
    allUsers: [User],
  }
`

export default [typeDefs]
