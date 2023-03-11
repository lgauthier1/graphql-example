import { shield } from 'graphql-shield'
import * as rules from './rules'

export const permissions = shield({
  User: {
    id: rules.isAdmin
  }
})
