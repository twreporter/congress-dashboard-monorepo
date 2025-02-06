import { list } from '@keystone-6/core'
import { relationship, text } from '@keystone-6/core/fields'
import { allowAllRoles } from './utils/access-control-list'
import { SLUG, CREATED_AT, UPDATED_AT } from './utils/common-field'

const listConfigurations = list({
  fields: {
    title: text({
      label: '主題',
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
