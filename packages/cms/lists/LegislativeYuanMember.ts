import { list } from '@keystone-6/core'
import { text, relationship, select } from '@keystone-6/core/fields'
import { allowAllRoles } from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'
import {
  MEMBER_TYPE_OPTIONS,
  CONSTITUENCY_OPTIONS,
  CITY_OPTIONS,
} from '../../shared/constants/legislative-yuan-member'

const listConfigurations = list({
  fields: {
    legislator: relationship({
      ref: 'Legislator',
      label: '委員資料',
      ui: {
        labelField: 'name',
      },
    }),
    party: relationship({
      ref: 'Party',
      label: '所屬政黨',
      ui: {
        labelField: 'name',
      },
    }),
    legislativeMeeting: relationship({
      ref: 'LegislativeMeeting',
      label: '所屬屆期',
      ui: {
        labelField: 'term',
      },
    }),
    type: select({
      label: '類別',
      options: MEMBER_TYPE_OPTIONS,
      validation: {
        isRequired: true,
      },
    }),
    constituency: select({
      label: '選區',
      options: CONSTITUENCY_OPTIONS,
    }),
    city: select({
      label: '所屬城市',
      options: CITY_OPTIONS,
    }),
    tooltip: text({
      label: '人物備註',
    }),
    note: text({
      label: '特殊說明',
    }),
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  ui: {
    label: '立委屆資',
    labelField: 'id',
    listView: {
      initialColumns: ['legislator', 'party', 'legislativeMeeting', 'type'],
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
