import { Access } from 'payload'

export const isAdmin: Access = ({ req: { users } }) => {
  // if (users?.role?.includes('admin')) {
  //   return true; // Explicit true
  // }
  const role = users?.role ?? []
  return role.includes('admin')

  return false // Explicit false for all other cases
}
const role = users?.role ?? []
return role.includes('admin')
