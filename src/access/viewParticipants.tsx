import { Access } from 'payload'

export const viewParticipants: Access = ({ req: { user } }) => {
  if (!user) {
    return false // Deny access if no user is logged in
  }

  const role = user.role

  // Full access for admin
  if (role === 'admin') {
    return true
  }
  if (role === 'influencer') {
    return true
  }

  // Restrict influencers to their own data
  if (role === 'agency') {
    return {
      createdBy: {
        equals: user.id, // Only allow access to their own data
      },
    }
  }

  // Deny access for all other roles
  return false
}
