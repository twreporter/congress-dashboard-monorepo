import { list } from '@keystone-6/core'
import { image, text } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  excludeReadOnlyRoles,
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
    name: text({
      label: '標題',
      validation: { isRequired: true },
      isIndexed: true,
    }),
    imageFile: image({
      storage: 'images',
    }),
    createdAt: CREATED_AT(),
    updatedAt: UPDATED_AT(),
  },
  ui: {
    label: 'Photos',
    labelField: 'name',
    listView: {
      initialColumns: ['name'],
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
      create: excludeReadOnlyRoles(),
      update: excludeReadOnlyRoles(),
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
          `Photo Item ID: ${id} Deleted by ${data.name}-${data.email}`,
          {
            context: {
              listKey: 'Photo',
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
