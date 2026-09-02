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
    councilMeeting: relationship({
      ref: 'CouncilMeeting',
      label: '所屬屆期',
      ui: {
        labelField: 'labelForCMS',
      },
    }),
    councilMember: relationship({
      ref: 'CouncilMember.speech',
      label: '所屬議員',
      many: true,
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
    sourceLink: text({
      label: '資料來源連結',
    }),
    topic: relationship({
      ref: 'CouncilTopic.speech',
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
    label: '縣市逐字稿',
    labelField: 'title',
    listView: {
      initialColumns: ['title', 'slug', 'councilMember', 'councilMeeting'],
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
          `Council Speech Item ID: ${id} Deleted by ${data.name}-${data.email}`,
          {
            context: {
              listKey: 'CouncilSpeech',
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
