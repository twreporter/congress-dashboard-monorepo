import { list } from '@keystone-6/core'
import { text, relationship, select, integer } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  excludeReadOnlyRoles,
  withReadOnlyRoleFieldMode,
  hideReadOnlyRoles,
} from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'
import {
  MemberType,
  MEMBER_TYPE_OPTIONS,
  CONSTITUENCY_OPTIONS,
  CITY_OPTIONS,
} from '@twreporter/congress-dashboard-shared/lib/constants/legislative-yuan-member'

const listConfigurations = list({
  fields: {
    legislator: relationship({
      ref: 'Legislator',
      label: '立法委員',
      ui: {
        labelField: 'name',
      },
    }),
    labelForCMS: text({
      hooks: {
        resolveInput: async ({ resolvedData, item, context }) => {
          const { legislator, legislativeMeeting, labelForCMS } = resolvedData

          const fetchLegislatorName = async (id: NonNullable<unknown>) => {
            const legislator = await context.query.Legislator.findOne({
              where: { id: Number(id) },
              query: 'name',
            })
            return legislator?.name
          }
          let legislatorName
          if (legislator?.connect?.id) {
            legislatorName = await fetchLegislatorName(legislator.connect.id)
          } else if (item?.legislatorId) {
            legislatorName = await fetchLegislatorName(item.legislatorId)
          }

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

          return legislatorName && legislativeMeetingTerm
            ? `${legislatorName} | 第 ${legislativeMeetingTerm} 屆`
            : labelForCMS
        },
      },
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
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
    sessionAndCommittee: relationship({
      ref: 'CommitteeMember.legislativeYuanMember',
      many: true,
      ui: {
        listView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'hidden',
        },
        createView: {
          fieldMode: 'hidden',
        },
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
    proposalSuccessCount: integer({
      label: '提案通過數',
    }),
    createdAt: CREATED_AT(),
    updatedAt: UPDATED_AT(),
  },
  ui: {
    label: '立委屆資',
    labelField: 'labelForCMS',
    listView: {
      initialColumns: ['legislator', 'party', 'legislativeMeeting', 'type'],
      initialSort: { field: 'labelForCMS', direction: 'DESC' },
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
  hooks: {
    validate: {
      create: ({ resolvedData, addValidationError }) => {
        const { legislator, legislativeMeeting, type, constituency } =
          resolvedData
        if (!legislator) addValidationError('立法委員為必填')
        if (!legislativeMeeting) addValidationError('所屬屆期為必填')
        if (type === MemberType.Constituency && !constituency)
          addValidationError('類別為區域時選區為必填')
      },
      update: ({ resolvedData, item, addValidationError }) => {
        const { legislator, legislativeMeeting, type, constituency } =
          resolvedData
        const {
          legislatorId,
          legislativeMeetingId,
          type: typeFromItem,
          constituency: constituencyFromItem,
        } = item

        const hasLegislator =
          !legislator?.disconnect && (legislator || legislatorId)
        const hasLegislativeMeeting =
          !legislativeMeeting?.disconnect &&
          (legislativeMeeting || legislativeMeetingId)

        if (!hasLegislator) addValidationError('立法委員為必填')
        if (!hasLegislativeMeeting) addValidationError('所屬屆期為必填')

        const effectiveType = type !== undefined ? type : typeFromItem
        const effectiveConstituency =
          constituency !== undefined ? constituency : constituencyFromItem
        if (effectiveType === MemberType.Constituency && !effectiveConstituency)
          addValidationError('類別為區域時選區為必填')
      },
    },
  },
})

export default listConfigurations
