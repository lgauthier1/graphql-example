import { shield } from 'graphql-shield'
import { isAuthenticad, isPublic } from './rules'
import { ApolloError } from 'apollo-server-express'

export const permissions = shield(
  {
    Query: {
      '*': isAuthenticad,
      login: isPublic,
      refreshTokens: isPublic
    },
    Mutation: {
      '*': isAuthenticad,
      register: isPublic
    }
  },
  {
    async fallbackError(exception) {
      console.log('fallbackError')
      // if (exception instanceof ApolloError) return exception // expected errors
      if (exception instanceof Error) {
        // unexpected errors
        console.error(exception)
        return new ApolloError('Internal server error', 'ERR_INTERNAL_SERVER')
      }
      console.error('The resolver threw something that is not an error.')
      console.error(exception)
      return new ApolloError('Internal server error', 'ERR_INTERNAL_SERVER')
    }
  }
)
