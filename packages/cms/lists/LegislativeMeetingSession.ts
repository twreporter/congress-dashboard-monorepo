import { list } from '@keystone-6/core'
import { integer, calendarDay, relationship } from '@keystone-6/core/fields'
import { allowAllRoles } from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'

const listConfigurations = list({
  fields: {
    legislativeMeeting: relationship({
      ref: 'LegislativeMeeting',
      label: '所屬屆期',
      ui: {
        labelField: 'term',
      },
    }),
    term: integer({
      label: '會期',
      validation: {
        isRequired: true,
        min: 1,
      },
    }),
    startTime: calendarDay({
      label: '會期起始時間',
      validation: {
        isRequired: true,
      },
    }),
    endTime: calendarDay({
      label: '會期結束時間',
      validation: {
        isRequired: true,
      },
    }),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  ui: {
    label: '立法院會期',
    labelField: 'term',
    listView: {
      initialColumns: ['legislativeMeeting', 'term', 'startTime', 'endTime'],
      initialSort: { field: 'startTime', direction: 'DESC' },
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
