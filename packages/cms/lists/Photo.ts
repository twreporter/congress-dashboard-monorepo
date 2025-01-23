import { list } from '@keystone-6/core'
import { image, text } from '@keystone-6/core/fields'
import { allowAllRoles } from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'

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
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  ui: {
    label: 'Photos',
    labelField: 'name',
    listView: {
      initialColumns: ['name'],
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
