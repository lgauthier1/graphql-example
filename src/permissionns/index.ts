import { shield } from 'graphql-shield'
import * as rules from './rules'

export const permissions = shield({
  Mutation: {
    create: rules.isAdmin,
  },
  User: {
    id: rules.isAdmin
  }
})
