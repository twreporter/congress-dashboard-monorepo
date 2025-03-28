import { list } from '@keystone-6/core'
import { relationship, text } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  excludeReadOnlyRoles,
  withReadOnlyRoleFieldMode,
  hideReadOnlyRoles,
} from './utils/access-control-list'
import { SLUG, CREATED_AT, UPDATED_AT } from './utils/common-field'

const listConfigurations = list({
  fields: {
    title: text({
      label: '議題名稱',
      validation: { isRequired: true },
      isIndexed: true,
    }),
    slug: SLUG,
    speeches: relationship({
      ref: 'Speech.topics',
      label: '逐字稿',
      many: true,
      ui: {
        labelField: 'title',
      },
    }),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  ui: {
    label: '議題',
    labelField: 'title',
    listView: {
      initialColumns: ['title', 'slug'],
      initialSort: { field: 'createdAt', direction: 'DESC' },
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
