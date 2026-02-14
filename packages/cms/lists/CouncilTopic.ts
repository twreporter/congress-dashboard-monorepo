import { list } from '@keystone-6/core'
import { relationship, text, json, select } from '@keystone-6/core/fields'
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
import {
  CITY_OPTIONS,
  CITY_LABEL,
} from '@twreporter/congress-dashboard-shared/lib/constants/city'
import {
  COUNCIL_TOPIC_TYPE_OPTIONS,
  COUNCIL_TOPIC_TYPE,
} from '@twreporter/congress-dashboard-shared/lib/constants/council-topic'

const listConfigurations = list({
  fields: {
    title: text({
      label: '議題名稱',
      validation: { isRequired: true },
      isIndexed: true,
    }),
    slug: SLUG,
    bill: relationship({
      ref: 'CouncilBill.topic',
      label: '縣市議案',
      many: true,
      ui: {
        labelField: 'title',
      },
    }),
    city: select({
      label: '所屬縣市',
      options: CITY_OPTIONS,
      validation: { isRequired: true },
    }),
    type: select({
      label: '議題類型',
      options: COUNCIL_TOPIC_TYPE_OPTIONS,
      defaultValue: COUNCIL_TOPIC_TYPE.general,
      validation: { isRequired: true },
    }),
    relatedLegislativeTopic: relationship({
      ref: 'Topic.relatedCouncilTopic',
      label: '立法院相關議題',
      many: true,
      ui: {
        labelField: 'title',
      },
    }),
    relatedCouncilTopic: relationship({
      ref: 'CouncilTopic.referencedByCouncilTopic',
      label: '縣市議會相關議題',
      many: true,
      ui: {
        labelField: 'labelForCMS',
      },
    }),
    referencedByCouncilTopic: relationship({
      ref: 'CouncilTopic.relatedCouncilTopic',
      label: '被關聯的縣市議題',
      many: true,
      ui: {
        labelField: 'labelForCMS',
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
        listView: { fieldMode: 'hidden' },
      },
    }),
    relatedCityCouncilTopic: relationship({
      ref: 'CouncilTopic.referencedByCityCouncilTopic',
      label: '同縣市議會相關議題',
      many: true,
      ui: {
        labelField: 'labelForCMS',
      },
    }),
    referencedByCityCouncilTopic: relationship({
      ref: 'CouncilTopic.relatedCityCouncilTopic',
      label: '被關聯的同縣市議會相關議題',
      many: true,
      ui: {
        labelField: 'labelForCMS',
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
        listView: { fieldMode: 'hidden' },
      },
    }),
    relatedTwreporterArticle: json({
      label: '相關報導者文章',
      defaultValue: [],
      ui: {
        views: './lists/views/related-article',
      },
    }),
    labelForCMS: text({
      hooks: {
        resolveInput: async ({ resolvedData, item }) => {
          const { labelForCMS } = resolvedData
          const city = resolvedData.city || item?.city
          const title = resolvedData.title || item?.title
          return city && title ? `${CITY_LABEL[city]}-${title}` : labelForCMS
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
    label: '縣市議題',
    labelField: 'title',
    listView: {
      initialColumns: ['title', 'slug', 'city', 'type'],
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
          `Council Topic Item ID: ${id} Deleted by ${data.name}-${data.email}`,
          {
            context: {
              listKey: 'Council Topic',
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
