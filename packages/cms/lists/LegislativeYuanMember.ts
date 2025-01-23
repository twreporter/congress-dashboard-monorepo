import { list } from '@keystone-6/core'
import { text, relationship, select } from '@keystone-6/core/fields'
import { allowAllRoles } from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'

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
      // TODO: use public constant
      options: [
        {
          label: '區域',
          value: 'constituency',
        },
        {
          label: '不分區',
          value: 'nationwide-and-overseas',
        },
        {
          label: '山地原住民',
          value: 'highland-aboriginal',
        },
        {
          label: '平地原住民',
          value: 'lowland-aboriginal',
        },
      ],
      validation: {
        isRequired: true,
      },
    }),
    constituency: select({
      label: '選區',
      // TODO: use public constant
      options: [
        {
          label: '臺北市第一選區',
          value: 'taipei-city-constituency-1',
        },
      ],
    }),
    city: select({
      label: '所屬城市',
      // TODO: use public constant
      options: [
        {
          label: '臺北市',
          value: 'taipei-city',
        },
      ],
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
