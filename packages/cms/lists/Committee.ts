import { list } from '@keystone-6/core'
import { text, select } from '@keystone-6/core/fields'
import { allowAllRoles } from './utils/access-control-list'
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
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  ui: {
    label: '委員會',
    labelField: 'name',
    listView: {
      initialColumns: ['name', 'slug', 'type'],
      initialSort: { field: 'name', direction: 'ASC' },
      pageSize: 50,
    },
  },
  access: {
    operation: {
      query: allowAllRoles(),
      create: allowAllRoles(),
      update: allowAllRoles(),
      delete: allowAllRoles(),
    },
  },
})

export default listConfigurations
