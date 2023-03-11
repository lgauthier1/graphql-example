const typeDefs = `#graphql
  type User{
    id: Int 
    name: String
    firstname: String
    age: Int
  }
  type Query {
    "List all Users (admin only)"
    allUsers: [User],
  }
`

export default [typeDefs]
