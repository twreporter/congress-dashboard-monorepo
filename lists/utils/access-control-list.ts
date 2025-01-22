import envVars from '../../environment-variables'

type Session = {
  data: {
    name: string
    email: string
    role: string
  }
}

export const RoleEnum = {
  Owner: 'owner',
  Admin: 'admin',
  Editor: 'editor',
}

export const allowRoles = (roles: string[]) => {
  return ({ session }: { session: Session }) => {
    if (envVars.nodeEnv === 'test') {
      return true
    }

    if (!Array.isArray(roles)) {
      return false
    }
    return Boolean(roles.indexOf(session?.data.role) > -1)
  }
}

export const allowAllRoles = () => {
  // Preview is not included in the list because it should not have access to the CMS
  const roles = [
    RoleEnum.Owner,
    RoleEnum.Admin,
    RoleEnum.Editor,
  ]
  return allowRoles(roles)
}

export const denyRoles = (roles: string[]) => {
  return ({ session }: { session: Session }) => {
    if (!Array.isArray(roles)) {
      return true
    }
    return roles.indexOf(session?.data.role) === -1
  }
}
