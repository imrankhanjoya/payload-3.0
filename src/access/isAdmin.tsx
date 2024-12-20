import { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  // if (user?.role?.includes('admin')) {
  //   return true; // Explicit true
  // }
  const role = (user?.role ?? []) as string[] // Assert type to string[]
  return role.includes('admin')
}
