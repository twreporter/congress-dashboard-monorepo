import { list } from '@keystone-6/core'
import { text, relationship } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  excludeReadOnlyRoles,
  withReadOnlyRoleFieldMode,
  hideReadOnlyRoles,
  allowRoles,
  RoleEnum,
  hideNotAllowDeleteRoles,
} from './utils/access-control-list'
import { SLUG, CREATED_AT, UPDATED_AT } from './utils/common-field'
import { logger } from '../utils/logger'

const listConfigurations = list({
  fields: {
    name: text({
      label: '政黨名稱',
      validation: { isRequired: true },
    }),
    slug: SLUG,
    image: relationship({
      label: '政黨照片',
      ref: 'Photo',
    }),
    imageLink: text({
      label: 'ImageLink',
    }),
    createdAt: CREATED_AT(),
    updatedAt: UPDATED_AT(),
  },
  ui: {
    label: '政黨',
    labelField: 'name',
    listView: {
      initialColumns: ['name', 'slug'],
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
          `Party Item ID: ${id} Deleted by ${data.name}-${data.email}`,
          {
            context: {
              listKey: 'Party',
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
