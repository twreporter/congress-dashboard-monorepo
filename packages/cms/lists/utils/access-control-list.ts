import envVars from '../../environment-variables'
import {
  BaseListTypeInfo,
  ListOperationAccessControl,
} from '@keystone-6/core/types'

export const RoleEnum = {
  Owner: 'owner',
  Admin: 'admin',
  Editor: 'editor',
} as const

type AccessOperation = 'query' | 'create' | 'update' | 'delete'

export const allowRoles =
  <Operation extends AccessOperation>(
    roles: string[]
  ): ListOperationAccessControl<Operation, BaseListTypeInfo> =>
  ({ session }) => {
    if (envVars.nodeEnv === 'test') {
      return true
    }

    if (!Array.isArray(roles)) {
      return false
    }
    return Boolean(roles.indexOf(session?.data?.role) > -1)
  }

export const allowAllRoles = () => {
  const roles = [RoleEnum.Owner, RoleEnum.Admin, RoleEnum.Editor]
  return allowRoles(roles)
}

export const denyRoles =
  <Operation extends AccessOperation>(
    roles: string[]
  ): ListOperationAccessControl<Operation, BaseListTypeInfo> =>
  ({ session }) => {
    if (!Array.isArray(roles)) {
      return true
    }
    return roles.indexOf(session?.data?.role) === -1
  }
