import { equal } from 'assert'
import { Access } from 'payload'

export const isAdmin: Access = ({ req: { users } }) => {
  if (users) {
    return Boolean(users.role?.includes('admin'))
  }
}
