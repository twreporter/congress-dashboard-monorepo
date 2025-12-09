import { list } from '@keystone-6/core'
import {
  text,
  relationship,
  select,
  integer,
  checkbox,
  json,
} from '@keystone-6/core/fields'
import {
  allowAllRoles,
  excludeReadOnlyRoles,
  withReadOnlyRoleFieldMode,
  hideReadOnlyRoles,
  allowRoles,
  RoleEnum,
  hideNotAllowDeleteRoles,
} from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'
import { logger } from '../utils/logger'
import {
  MEMBER_TYPE,
  MEMBER_TYPE_OPTIONS,
} from '@twreporter/congress-dashboard-shared/lib/constants/council-member'
import {
  CITY_OPTIONS,
  CITY_LABEL,
} from '@twreporter/congress-dashboard-shared/lib/constants/city'

const listConfigurations = list({
  fields: {
    councilor: relationship({
      ref: 'Councilor',
      label: '縣市議員',
      ui: {
        labelField: 'name',
      },
    }),
    labelForCMS: text({
      hooks: {
        resolveInput: async ({ resolvedData, item, context }) => {
          const { councilor, councilMeeting, labelForCMS } = resolvedData

          const fetchCouncilorName = async (id: NonNullable<unknown>) => {
            const councilor = await context.query.Councilor.findOne({
              where: { id: Number(id) },
              query: 'name',
            })
            return councilor?.name
          }
          let councilorName
          if (councilor?.connect?.id) {
            councilorName = await fetchCouncilorName(councilor.connect.id)
          } else if (item?.councilorId) {
            councilorName = await fetchCouncilorName(item.councilorId)
          }

          const fetchCouncilMeeting = async (id: NonNullable<unknown>) => {
            const councilMeeting = await context.query.CouncilMeeting.findOne({
              where: { id: Number(id) },
              query: 'city term',
            })
            return councilMeeting
          }
          let councilMeetingData
          if (councilMeeting?.connect?.id) {
            councilMeetingData = await fetchCouncilMeeting(
              councilMeeting.connect.id
            )
          } else if (item?.councilMeetingId) {
            councilMeetingData = await fetchCouncilMeeting(
              item.councilMeetingId
            )
          }

          return councilorName && councilMeetingData
            ? `${councilorName} | ${CITY_LABEL[councilMeetingData.city]} - 第 ${
                councilMeetingData.term
              } 屆`
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
    councilMeeting: relationship({
      ref: 'CouncilMeeting',
      label: '所屬屆期',
      ui: {
        labelField: 'labelForCMS',
      },
    }),
    bill: relationship({
      ref: 'CouncilBill.councilMember',
      label: '發言紀錄',
      many: true,
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'read',
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
    city: select({
      label: '所屬城市',
      options: CITY_OPTIONS,
      validation: {
        isRequired: true,
      },
    }),
    constituency: integer({
      label: '選區',
    }),
    administrativeDistrict: json({
      label: '所屬行政區',
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
    relatedLink: json({
      label: '相關連結',
    }),
    isActive: checkbox({
      label: '是否該屆期現任',
      defaultValue: true,
    }),
    createdAt: CREATED_AT(),
    updatedAt: UPDATED_AT(),
  },
  ui: {
    label: '議員屆資',
    labelField: 'labelForCMS',
    listView: {
      initialColumns: ['councilor', 'party', 'councilMeeting', 'type'],
      initialSort: { field: 'labelForCMS', direction: 'DESC' },
      pageSize: 50,
    },
    itemView: {
      defaultFieldMode: withReadOnlyRoleFieldMode,
    },
    hideCreate: hideReadOnlyRoles,
    hideDelete: hideNotAllowDeleteRoles,
  },
  access: {
    operation: {
      query: allowAllRoles(),
      create: excludeReadOnlyRoles(),
      update: excludeReadOnlyRoles(),
      delete: allowRoles([RoleEnum.Owner]),
    },
  },
  hooks: {
    validate: {
      create: ({ resolvedData, addValidationError }) => {
        const { councilor, councilMeeting, type, constituency } = resolvedData
        if (!councilor) addValidationError('議員為必填')
        if (!councilMeeting) addValidationError('所屬屆期為必填')
        if (type === MEMBER_TYPE.constituency && !constituency)
          addValidationError('類別為區域時選區為必填')
      },
      update: ({ resolvedData, item, addValidationError }) => {
        const { councilor, councilMeeting, type, constituency } = resolvedData
        const {
          councilorId,
          councilMeetingId,
          type: typeFromItem,
          constituency: constituencyFromItem,
        } = item

        const hasCouncilor =
          !councilor?.disconnect && (councilor || councilorId)
        const hasCouncilMeeting =
          !councilMeeting?.disconnect && (councilMeeting || councilMeetingId)

        if (!hasCouncilor) addValidationError('議員為必填')
        if (!hasCouncilMeeting) addValidationError('所屬屆期為必填')

        const effectiveType = type !== undefined ? type : typeFromItem
        const effectiveConstituency =
          constituency !== undefined ? constituency : constituencyFromItem
        if (
          effectiveType === MEMBER_TYPE.constituency &&
          !effectiveConstituency
        )
          addValidationError('類別為區域時選區為必填')
      },
    },
    afterOperation: {
      delete: async ({ originalItem, context }) => {
        const { session } = context
        const { data } = session
        const { id } = originalItem
        logger.info(
          `Council Member Item ID: ${id} Deleted by ${data.name}-${data.email}`,
          {
            context: {
              listKey: 'Council Member',
              itemId: id,
              userEmail: data.email,
              userName: data.name,
            },
          }
        )
      },
    },
  },
})

export default listConfigurations
