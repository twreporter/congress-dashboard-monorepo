import { list } from '@keystone-6/core'
import { text } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  withReadOnlyRoleFieldMode,
  hideReadOnlyRoles,
  allowRoles,
  RoleEnum,
  hideNotAllowDeleteRoles,
} from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'
import { logger } from '../utils/logger'

const listConfigurations = list({
  fields: {
    twreporterUserId: text({
      label: 'TWReporter 會員 ID',
      validation: { isRequired: true },
      isIndexed: 'unique',
      ui: {
        itemView: { fieldMode: 'read' },
        listView: { fieldMode: 'read' },
      },
    }),
    email: text({
      label: 'Email',
      isIndexed: 'unique',
    }),
    name: text({
      label: '姓名',
    }),
    createdAt: CREATED_AT(),
    updatedAt: UPDATED_AT(),
  },
  ui: {
    label: '會員',
    labelField: 'name',
    listView: {
      initialColumns: ['id', 'twreporterUserId', 'email', 'name'],
      initialSort: { field: 'createdAt', direction: 'DESC' },
      pageSize: 50,
    },
    itemView: {
      defaultFieldMode: withReadOnlyRoleFieldMode,
    },
    hideCreate: hideReadOnlyRoles,
    hideDelete: hideNotAllowDeleteRoles,
  },
  access: {
    operation: {
      query: allowAllRoles(),
      create: allowAllRoles(),
      update: allowAllRoles(),
      delete: allowRoles([RoleEnum.Owner]),
    },
  },
  hooks: {
    afterOperation: {
      delete: async ({ originalItem, context }) => {
        const { session } = context
        const { data } = session
        const { id } = originalItem
        logger.info(
          `Member Item ID: ${id} Deleted by ${data.name}-${data.email}`,
          {
            context: {
              listKey: 'Member',
              itemId: id,
              userEmail: data.email,
              userName: data.name,
            },
          }
        )
      },
    },
  },
})

export default listConfigurations
