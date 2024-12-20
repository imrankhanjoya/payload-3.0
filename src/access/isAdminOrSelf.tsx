import { Access } from 'payload'

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  const role = user?.role ?? []
  // return role.includes('admin')

  if (user) {
    if (role?.includes('admin')) {
      return true
    }
    return {
      id: { equals: user?.id },
    }
  }

  return false
}
