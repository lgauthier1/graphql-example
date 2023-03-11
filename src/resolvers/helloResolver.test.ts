import { ApolloServer, gql } from 'apollo-server-express'
import assert from 'node:assert'

import typeDefs from '../typeDefs'
import resolvers from './'

const HELLO = gql`
  query Query {
    hello
  }
`

it('returns hello with the provided name', async () => {
  const testServer = new ApolloServer({
    typeDefs,
    resolvers
  })

  const response = await testServer.executeOperation({
    query: HELLO,
    variables: {}
  })

  // Note the use of Node's assert rather than Jest's expect; if using
  // TypeScript, `assert`` will appropriately narrow the type of `body`
  // and `expect` will not.
  assert(response)
  assert(response.data)
  assert(response.data.hello)
  expect(response?.data.hello).toBe('hello world2')
})
