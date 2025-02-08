import { list } from '@keystone-6/core'
import { relationship } from '@keystone-6/core/fields'
import { allowAllRoles } from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'

const listConfigurations = list({
  fields: {
    legislativeMeetingSession: relationship({
      ref: 'LegislativeMeetingSession',
      label: '所屬會期',
      ui: {
        labelField: 'labelForCMS',
      },
    }),
    legislativeYuanMember: relationship({
      ref: 'LegislativeYuanMember.sessionAndCommittee',
      label: '立委屆資',
      ui: {
        labelField: 'labelForCMS',
      },
    }),
    committee: relationship({
      ref: 'Committee',
      label: '委員會',
      many: true,
      ui: {
        labelField: 'name',
      },
    }),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  ui: {
    label: '委員會屆資',
    labelField: 'id',
    listView: {
      initialColumns: [
        'legislativeMeetingSession',
        'legislativeYuanMember',
        'committee',
      ],
      initialSort: { field: 'id', direction: 'DESC' },
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
