import { list } from '@keystone-6/core'
import { relationship, text, json } from '@keystone-6/core/fields'
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

const listConfigurations = list({
  fields: {
    title: text({
      label: '議題名稱',
      validation: { isRequired: true },
      isIndexed: true,
    }),
    slug: SLUG,
    speeches: relationship({
      ref: 'Speech.topics',
      label: '逐字稿',
      many: true,
      ui: {
        labelField: 'title',
      },
    }),
    relatedTopics: relationship({
      ref: 'Topic.referencedByTopics',
      label: '相關議題',
      many: true,
      ui: {
        labelField: 'title',
      },
    }),
    referencedByTopics: relationship({
      ref: 'Topic.relatedTopics',
      label: '被關聯的議題',
      many: true,
      ui: {
        labelField: 'title',
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
        listView: { fieldMode: 'hidden' },
      },
    }),
    relatedTwreporterArticles: json({
      label: '相關文章',
      defaultValue: [],
      ui: {
        views: './lists/views/related-article',
      },
    }),
    createdAt: CREATED_AT(),
    updatedAt: UPDATED_AT(),
  },
  ui: {
    label: '立法院議題',
    labelField: 'title',
    listView: {
      initialColumns: ['title', 'slug'],
      initialSort: { field: 'createdAt', direction: 'DESC' },
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
          `Topic Item ID: ${id} Deleted by ${data.name}-${data.email}`,
          {
            context: {
              listKey: 'Topic',
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
