import { ApolloServer, gql } from 'apollo-server-express'
import assert from 'node:assert'

import typeDefs from '../typeDefs'
import resolvers from './'

const HELLO = gql`
  query Query {
    hello
  }
`

describe('RESOLVERS: Hello resolver', () => {
  it('returns Hello World', async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers
    })

    const response = await testServer.executeOperation({
      query: HELLO,
      variables: {}
    })
    assert(response)
    assert(response.data)
    assert(response.data.hello)
    expect(response?.data.hello).toBe('hello world')
  })
})
