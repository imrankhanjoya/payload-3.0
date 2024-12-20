import { equal } from 'assert'
import { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  if (user) {
    return Boolean(user.role?.includes('admin'))
  }
}
