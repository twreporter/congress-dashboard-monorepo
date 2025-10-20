import envVars from '../../environment-variables'
import {
  BaseListTypeInfo,
  ListOperationAccessControl,
  MaybeItemFunction,
  MaybeSessionFunction,
} from '@keystone-6/core/types'
import { get } from 'lodash'
const _ = {
  get,
}

export const RoleEnum = {
  Owner: 'owner',
  Admin: 'admin',
  Editor: 'editor',
  Headless: 'developer_headless_account',
} as const

type AccessOperation = 'query' | 'create' | 'update' | 'delete'

const readonlyRoles: readonly string[] = [RoleEnum.Headless]
const allowDeleteRoles: readonly string[] = [RoleEnum.Owner]

export const allowRoles =
  <Operation extends AccessOperation>(
    roles: readonly string[]
  ): ListOperationAccessControl<Operation, BaseListTypeInfo> =>
  ({ session }) => {
    if (envVars.nodeEnv === 'test') {
      return true
    }

    if (!Array.isArray(roles)) {
      return false
    }
    return Boolean(roles.includes(session?.data?.role))
  }

export const allowAllRoles = () => {
  const roles = [
    RoleEnum.Owner,
    RoleEnum.Admin,
    RoleEnum.Editor,
    RoleEnum.Headless,
  ]
  return allowRoles(roles)
}

export const denyRoles =
  <Operation extends AccessOperation>(
    roles: readonly string[]
  ): ListOperationAccessControl<Operation, BaseListTypeInfo> =>
  ({ session }) => {
    if (!Array.isArray(roles)) {
      return true
    }
    return !roles.includes(session?.data?.role)
  }

export const excludeReadOnlyRoles = () => {
  return denyRoles(readonlyRoles)
}

type fieldMode = 'edit' | 'hidden' | 'read'
export const withReadOnlyRoleFieldMode: MaybeItemFunction<
  fieldMode,
  BaseListTypeInfo
> = ({ session }) => {
  const role = _.get(session, ['data', 'role'], '')
  if (readonlyRoles.includes(role)) {
    return 'read'
  } else {
    return 'edit'
  }
}

export const hideReadOnlyRoles: MaybeSessionFunction<
  boolean,
  BaseListTypeInfo
> = ({ session }) => {
  const role = _.get(session, ['data', 'role'], '')
  if (readonlyRoles.includes(role)) {
    return true
  }
  return false
}

export const hideNotAllowDeleteRoles: MaybeSessionFunction<
  boolean,
  BaseListTypeInfo
> = ({ session }) => {
  const role = _.get(session, ['data', 'role'], '')
  if (allowDeleteRoles.includes(role)) {
    return false
  }
  return true
}
