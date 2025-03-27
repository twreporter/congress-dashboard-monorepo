import { list } from '@keystone-6/core'
import {
  integer,
  calendarDay,
  relationship,
  text,
} from '@keystone-6/core/fields'
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
    labelForCMS: text({
      hooks: {
        resolveInput: async ({ resolvedData, item, context }) => {
          const { legislativeMeeting, term } = resolvedData

          const fetchLegislativeMeetingTerm = async (
            id: NonNullable<unknown>
          ) => {
            const legislativeMeeting =
              await context.query.LegislativeMeeting.findOne({
                where: { id: Number(id) },
                query: 'term',
              })
            return legislativeMeeting?.term
          }
          let legislativeMeetingTerm
          if (legislativeMeeting?.connect?.id) {
            legislativeMeetingTerm = await fetchLegislativeMeetingTerm(
              legislativeMeeting.connect.id
            )
          } else if (item?.legislativeMeetingId) {
            legislativeMeetingTerm = await fetchLegislativeMeetingTerm(
              item.legislativeMeetingId
            )
          }
          const sessionTerm = term || item?.term
          return sessionTerm && legislativeMeetingTerm
            ? `第 ${legislativeMeetingTerm} 屆 | 第 ${sessionTerm} 會期`
            : resolvedData.labelForCMS
        },
      },
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
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
    labelField: 'labelForCMS',
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
