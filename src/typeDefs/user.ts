const typeDefs = `#graphql
  type User{
    id: Int 
    name: String
    firstname: String
    age: Int
  }
  type Query {
    allUsers: [User],
  }
  type Mutation {
    "Create a new user"
     create(email: String!, firstname: String!, name: String!, age: Int!): User
  }
`;

export default [typeDefs]
