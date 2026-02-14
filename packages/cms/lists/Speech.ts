import { list, graphql } from '@keystone-6/core'
import {
  text,
  relationship,
  calendarDay,
  json,
  virtual,
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
import { SLUG, CREATED_AT, UPDATED_AT } from './utils/common-field'
import toPlainTextSummary from './utils/summary-parser'
import { logger } from '../utils/logger'

const listConfigurations = list({
  fields: {
    legislativeMeeting: relationship({
      ref: 'LegislativeMeeting',
      label: '所屬屆期',
      ui: {
        labelField: 'term',
      },
    }),
    legislativeMeetingSession: relationship({
      ref: 'LegislativeMeetingSession',
      label: '所屬會期',
      ui: {
        labelField: 'labelForCMS',
      },
    }),
    legislativeYuanMember: relationship({
      ref: 'LegislativeYuanMember.speeches',
      label: '立委屆資',
      many: false,
      ui: {
        labelField: 'labelForCMS',
      },
    }),
    date: calendarDay({
      label: '日期',
      isIndexed: true,
      validation: {
        isRequired: true,
      },
    }),
    title: text({
      label: '標題',
      validation: { isRequired: true },
      isIndexed: true,
    }),
    slug: SLUG,
    summary: json({
      label: '摘要',
    }),
    summaryFallback: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve(item) {
          return toPlainTextSummary('speech', item.summary)
        },
      }),
    }),
    // TODO: change to editor
    content: json({
      label: '內文',
    }),
    attendee: text({
      label: '列席質詢對象',
    }),
    ivodLink: text({
      label: 'ivod 連結',
    }),
    ivodStartTime: text({
      label: 'ivod 起始時間',
    }),
    ivodEndTime: text({
      label: 'ivod 結束時間',
    }),
    topics: relationship({
      ref: 'Topic.speeches',
      label: '所屬議題',
      many: true,
      ui: {
        labelField: 'title',
      },
    }),
    createdAt: CREATED_AT(),
    updatedAt: UPDATED_AT({
      isIndexed: true,
    }),
  },
  ui: {
    label: '逐字稿',
    labelField: 'title',
    listView: {
      initialColumns: [
        'title',
        'slug',
        'legislativeYuanMember',
        'legislativeMeeting',
        'legislativeMeetingSession',
      ],
      initialSort: { field: 'date', direction: 'DESC' },
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
          `Speech Item ID: ${id} Deleted by ${data.name}-${data.email}`,
          {
            context: {
              listKey: 'Speech',
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
