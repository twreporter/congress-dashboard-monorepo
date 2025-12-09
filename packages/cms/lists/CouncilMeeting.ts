import { list } from '@keystone-6/core'
import { integer, calendarDay, select, text } from '@keystone-6/core/fields'
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
  CITY_OPTIONS,
  CITY_LABEL,
} from '@twreporter/congress-dashboard-shared/lib/constants/city'

const listConfigurations = list({
  fields: {
    city: select({
      label: '所屬縣市',
      options: CITY_OPTIONS,
      validation: { isRequired: true },
    }),
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
      ui: {
        views: './lists/views/custom-date-picker',
      },
    }),
    endTime: calendarDay({
      label: '屆期結束時間',
      validation: {
        isRequired: true,
      },
      ui: {
        views: './lists/views/custom-date-picker',
      },
    }),
    labelForCMS: text({
      hooks: {
        resolveInput: async ({ resolvedData, item }) => {
          const { labelForCMS } = resolvedData
          const city = resolvedData.city || item?.city
          const term = resolvedData.term || item?.term
          return city && term
            ? `${CITY_LABEL[city]} - 第 ${term} 屆`
            : labelForCMS
        },
      },
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'hidden' },
        listView: { fieldMode: 'hidden' },
      },
    }),
    createdAt: CREATED_AT(),
    updatedAt: UPDATED_AT(),
  },
  ui: {
    label: '議會屆期',
    labelField: 'labelForCMS',
    listView: {
      initialColumns: ['city', 'term', 'startTime', 'endTime'],
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
    afterOperation: {
      delete: async ({ originalItem, context }) => {
        const { session } = context
        const { data } = session
        const { id } = originalItem
        logger.info(
          `Council Meeting Item ID: ${id} Deleted by ${data.name}-${data.email}`,
          {
            context: {
              listKey: 'Council Meeting',
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
