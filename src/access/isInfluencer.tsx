import { Access } from 'payload'

export const isInfluencer: Access = ({ req: { user } }) => {
  if (!user) {
    return false // Deny access if no user is logged in
  }

  const role = user.role

  console.log('🚀 Brij  ~  file: isInfluencer.tsx:10 ~  user:', user)

  // Full access for admin
  if (role === 'admin') {
    return true
  }

  // Restrict influencers to their own data
  if (role === 'influencer') {
    return {
      influencer: {
        equals: user.id, // Only allow access to their own data
      },
    }
  }

  // Deny access for all other roles
  return false
}
