import { ApolloServer, gql } from 'apollo-server-express'
import { MockContext, createMockContext } from '../prisma'
import { hashPassword } from '../utils/authentification'
import { Context } from '../utils/types'
import { User } from '@prisma/client'
import assert from 'node:assert'

import typeDefs from '../typeDefs'
import resolvers from '.'

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context
})

const QUERY_REGISTER = gql`
  mutation Mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`

const QUERY_LOGIN = gql`
  query Query($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      refreshToken
      accessToken
    }
  }
`
const expected: User = {
  id: 1,
  email: 'test@gmail.com',
  username: 'testuser',
  password: hashPassword('secret'),
  confirmed: false,
  createAt: new Date(),
  updatedAt: new Date()
}

describe('RESOLVERS: Authentification resolver - Login', () => {
  it('login with existing user and correct password', async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: ctx
    })
    // MOCK Prisma answer
    ;(
      ctx.prisma.user.findUnique as jest.MockedFunction<
        typeof ctx.prisma.user.findUnique
      >
    ).mockResolvedValue(expected)
    const response = await testServer.executeOperation({
      query: QUERY_LOGIN,
      variables: { email: 'test@gmail.com', password: 'secret' }
    })
    assert(response.data)
    assert(response.data.login.accessToken)
    assert(response.data.login.refreshToken)
    expect(response.data.login.accessToken).toBeDefined()
    expect(response.data.login.refreshToken).toBeDefined()
  })

  it('login with existing user and wrong password', async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: ctx
    })
    // MOCK Prisma answer
    ;(
      ctx.prisma.user.findUnique as jest.MockedFunction<
        typeof ctx.prisma.user.findUnique
      >
    ).mockResolvedValue(expected)
    const response = await testServer.executeOperation({
      query: QUERY_LOGIN,
      variables: { email: 'test@gmail.com', password: 'secretWRONG' }
    })

    assert(response)
    assert(response?.errors)
    expect(response?.errors[0].message).toEqual('wrong_email_password')
    expect(response?.errors[0]?.extensions?.code).toEqual('UNAUTHENTICATED')
  })

  it('login with unregister user', async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: ctx
    })
    // MOCK Prisma answer
    ;(
      ctx.prisma.user.findUnique as jest.MockedFunction<
        typeof ctx.prisma.user.findUnique
      >
    ).mockResolvedValue(null)
    const response = await testServer.executeOperation({
      query: QUERY_LOGIN,
      variables: { email: 'test@gmail.com', password: 'secret' }
    })

    assert(response)
    assert(response?.errors)
    expect(response?.errors[0].message).toEqual('wrong_email_or_password')
    expect(response?.errors[0]?.extensions?.code).toEqual('UNAUTHENTICATED')
  })

  it('login with empty fields throw an error', async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers
    })
    const response = await testServer.executeOperation({
      query: QUERY_LOGIN,
      variables: { email: '', password: '' }
    })
    assert(response)
    assert(response?.errors)
    expect(response?.errors[0].message).toEqual('wrong_email_or_password')
    expect(response?.errors[0]?.extensions?.code).toEqual('UNAUTHENTICATED')
  })
})

describe('RESOLVERS: Authentification resolver - Register', () => {
  it('register a new user', async () => {
    const testServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: ctx
    })
    // MOCK Prisma answer
    ;(
      ctx.prisma.user.create as jest.MockedFunction<
        typeof ctx.prisma.user.create
      >
    ).mockResolvedValue(expected)
    const response = await testServer.executeOperation({
      query: QUERY_REGISTER,
      variables: {
        email: 'test@gmail.com',
        username: 'test',
        password: 'secret'
      }
    })
    assert(response.data)
    assert(response.data.register.accessToken)
    assert(response.data.register.refreshToken)
    expect(response.data.register.accessToken).toBeDefined()
    expect(response.data.register.refreshToken).toBeDefined()
  })
})
