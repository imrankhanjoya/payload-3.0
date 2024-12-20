import { Access } from 'payload'

export const isAdminOrSelf: Access = ({ req: { users } }) => {
  const role = users?.role ?? []
  // return role.includes('admin')

  if (users) {
    if (role?.includes('admin')) {
      return true
    }
    return {
      id: { equals: users?.id },
    }
  }

  return false
}
