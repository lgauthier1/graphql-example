import { MockContext, createMockContext } from '../context'
import { Context } from '../utils/types'
import { createUser } from './user'
import { User } from '@prisma/client'

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context
})

describe('SERVICES: Test user service', () => {
  const testUserInput = {
    email: 'test@gmail.com',
    username: 'testuser',
    password: 'secrect'
  }
  const expected: User = {
    id: 1,
    email: 'test@gmail.com',
    username: 'testuser',
    password: 'secrect',
    confirmed: false,
    createAt: new Date(),
    updatedAt: new Date()
  }

  it('test create a user', async () => {
    ;(
      ctx.prisma.user.create as jest.MockedFunction<
        typeof ctx.prisma.user.create
      >
    ).mockResolvedValue(expected)
    const user = await createUser(ctx.prisma, testUserInput)
    expect(user).toEqual(expected)
  })
})
