import { Access } from 'payload'

export const updateUser: Access = ({ req: { user } }) => {
  if (!user) {
    return false // Deny access if no user is logged in
  }

  const role = user.role

  // Full access for admin
  if (role === 'admin') {
    return true
  }

  // Restrict influencers to their own data
  if (role === 'agency' || role === 'editor') {
    return {
      id: {
        equals: user.id, // Only allow access to their own data
      },
    }
  }

  // Deny access for all other roles
  return false
}
