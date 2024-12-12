const checkRoleAccess =
  (requiredRoles: string[]) =>
  ({ req }) => {
    const user = req.user

    if (!user) return false

    const { role } = user // Use 'role' instead of 'roles'

    return requiredRoles.includes(role) // Adjust for a single role
  }

export default checkRoleAccess
