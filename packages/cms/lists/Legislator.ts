import { list } from '@keystone-6/core'
import { text, relationship, integer } from '@keystone-6/core/fields'
import { allowAllRoles } from './utils/access-control-list'
import { SLUG, CREATED_AT, UPDATED_AT } from './utils/common-field'

const listConfigurations = list({
  fields: {
    name: text({
      label: '姓名',
      validation: {
        isRequired: true,
      },
    }),
    slug: SLUG,
    image: relationship({
      ref: 'Photo',
      label: '委員照片',
    }),
    imageLink: text({
      label: 'ImageLink',
    }),
    externalLink: text({
      label: '外部連結',
    }),
    meetingTermCount: integer({
      label: '立委任期屆數',
    }),
    meetingTermCountInfo: text({
      label: '立委任期屆數說明',
    }),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  ui: {
    label: '立法委員',
    labelField: 'name',
    listView: {
      initialColumns: ['name', 'slug'],
      initialSort: { field: 'name', direction: 'DESC' },
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
