import { Access } from 'payload'

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  const role = (user?.role ?? []) as string[] // Assert type to string[]
  if (user) {
    if (role?.includes('admin')) {
      return true
    }
    return {
      createdBy: { equals: user?.id },
    }
  }

  return false
}
