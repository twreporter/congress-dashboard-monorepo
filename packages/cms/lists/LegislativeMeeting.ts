import { list } from '@keystone-6/core'
import { integer, calendarDay, relationship } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  excludeReadOnlyRoles,
  withReadOnlyRoleFieldMode,
  hideReadOnlyRoles,
} from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'

const listConfigurations = list({
  fields: {
    term: integer({
      label: '屆期',
      isIndexed: 'unique',
      validation: {
        isRequired: true,
        min: 1,
      },
    }),
    startTime: calendarDay({
      label: '屆期起始時間',
      validation: {
        isRequired: true,
      },
    }),
    endTime: calendarDay({
      label: '屆期結束時間',
      validation: {
        isRequired: true,
      },
    }),
    committees: relationship({
      ref: 'Committee',
      label: '委員會',
      many: true,
    }),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  ui: {
    label: '立法院屆期',
    labelField: 'term',
    listView: {
      initialColumns: ['term', 'startTime', 'endTime'],
      initialSort: { field: 'term', direction: 'DESC' },
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
