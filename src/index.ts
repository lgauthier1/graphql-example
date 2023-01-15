import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { createContext } from './context'
import { applyMiddleware } from 'graphql-middleware'
// import { authMiddleWare, dataFiltering } from "./middleware"
import { permissions } from './permissionns'
import typeDefs from './typeDefs'
import resolvers from './resolvers'



const schema = makeExecutableSchema({ typeDefs, resolvers })
// const schemaWithMiddleware = applyMiddleware(schema, authMiddleWare, dataFiltering)
const schemaWithMiddleware = applyMiddleware(schema, permissions)

const server = new ApolloServer({
  schema: schemaWithMiddleware,
  context: createContext
});

;(async function () {
  const app = express()
  await server.start()
  server.applyMiddleware({ app, path: '/' })
  app.listen(4000, () => {
    console.log('🚀 Server ready at http://localhost:4000')
  })
})()
