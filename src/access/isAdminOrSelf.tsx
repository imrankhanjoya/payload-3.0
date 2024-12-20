import { Access } from 'payload'

export const isAdminOrSelf: Access = ({ req: { users } }) => {
  if (users) {
    if (users.role?.includes('admin')) {
      return true
    }
    return {
      id: { equals: users.id },
    }
  }

  return false
}
