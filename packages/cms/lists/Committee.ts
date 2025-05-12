import { list } from '@keystone-6/core'
import { text, select } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  excludeReadOnlyRoles,
  withReadOnlyRoleFieldMode,
  hideReadOnlyRoles,
} from './utils/access-control-list'
import { SLUG, CREATED_AT, UPDATED_AT } from './utils/common-field'

const listConfigurations = list({
  fields: {
    name: text({
      label: '委員會名稱',
      isIndexed: true,
    }),
    slug: SLUG,
    type: select({
      label: '委員會類型',
      options: [
        {
          label: '常設委員會',
          value: 'standing',
        },
        {
          label: '特種委員會',
          value: 'ad-hoc',
        },
      ],
      isIndexed: true,
    }),
    createdAt: CREATED_AT(),
    updatedAt: UPDATED_AT(),
  },
  ui: {
    label: '委員會',
    labelField: 'name',
    listView: {
      initialColumns: ['name', 'slug', 'type'],
      initialSort: { field: 'name', direction: 'ASC' },
      pageSize: 50,
    },
    itemView: {
      defaultFieldMode: withReadOnlyRoleFieldMode,
    },
    hideCreate: hideReadOnlyRoles,
    hideDelete: hideReadOnlyRoles,
  },
  access: {
    operation: {
      query: allowAllRoles(),
      create: excludeReadOnlyRoles(),
      update: excludeReadOnlyRoles(),
      delete: excludeReadOnlyRoles(),
    },
  },
})

export default listConfigurations
