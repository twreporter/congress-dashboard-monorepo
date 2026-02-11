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
import { logger } from '../utils/logger'

/* take 100 characters of content as summary */
function toPlainTextSummary(input: unknown, limit = 100): string | null {
  if (input === null) {
    return null
  }
  const raw =
    typeof input === 'string'
      ? input
      : typeof input === 'object'
      ? JSON.stringify(input)
      : String(input)

  const listRegrex = /<\/?(ul|li)[^>]*>/g
  const lineBreakRegex = /\\n|\r?\n/g
  const summary = raw.replace(listRegrex, '').replace(lineBreakRegex, ' ')
  return summary.length > limit ? summary.slice(0, limit) : summary
}

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
      ref: 'CouncilMember.bill',
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
          const value =
            typeof item.summary === 'string' && item.summary.length > 0
              ? item.summary
              : item.content ?? null
          return toPlainTextSummary(value)
        },
      }),
    }),
    // TODO: change to editor
    content: json({
      label: '內文',
    }),
    attendee: text({
      label: '連署人',
      db: { nativeType: 'VarChar(500)' },
    }),
    sourceLink: json({
      label: '資料來源連結',
    }),
    topic: relationship({
      ref: 'CouncilTopic.bill',
      label: '所屬議題',
      many: true,
      ui: {
        labelField: 'labelForCMS',
      },
    }),
    createdAt: CREATED_AT(),
    updatedAt: UPDATED_AT({
      isIndexed: true,
    }),
  },
  ui: {
    label: '縣市議案',
    labelField: 'title',
    listView: {
      initialColumns: ['title', 'slug', 'councilMeeting', 'councilMember'],
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
          `Council Bill Item ID: ${id} Deleted by ${data.name}-${data.email}`,
          {
            context: {
              listKey: 'Council Bill',
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
