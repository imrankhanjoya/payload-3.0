import { Access } from 'payload'

export const createBrand: Access = ({ req: { user } }) => {
  if (!user) {
    return false // Deny access if no user is logged in
  }

  const role = user.role

  // Full access for admin
  if (role === 'admin' || role === 'agency') {
    return true
  }


  // Deny access for all other roles
  return false
}
