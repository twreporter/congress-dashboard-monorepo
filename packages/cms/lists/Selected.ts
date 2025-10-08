import { list, graphql } from '@keystone-6/core'
import { relationship, integer, virtual } from '@keystone-6/core/fields'
import {
  allowAllRoles,
  excludeReadOnlyRoles,
  withReadOnlyRoleFieldMode,
  hideReadOnlyRoles,
} from './utils/access-control-list'
import { CREATED_AT, UPDATED_AT } from './utils/common-field'

const listConfigurations = list({
  fields: {
    legislator: relationship({
      ref: 'Legislator',
      label: '委員',
      ui: {
        labelField: 'name',
        description: '不能同時選擇委員和議題',
      },
    }),
    topic: relationship({
      ref: 'Topic',
      label: '議題',
      ui: {
        labelField: 'title',
        description: '不能同時選擇委員和議題',
      },
    }),
    order: integer({
      label: '順序',
      validation: {
        min: 1,
        isRequired: true,
      },
      ui: {
        description: '越小排越前面',
      },
    }),
    labelField: virtual({
      field: graphql.field({
        type: graphql.String,
        async resolve(item, _args, context) {
          const { legislatorId, topicId } = item
          if (legislatorId) {
            const legislator = await context.query.Legislator.findOne({
              where: { id: Number(legislatorId) },
              query: 'name',
            })
            return legislator && legislator.name
          } else {
            const topic = await context.query.Topic.findOne({
              where: { id: Number(topicId) },
              query: 'title',
            })
            return topic && topic.title
          }
        },
      }),
      ui: {
        itemView: {
          fieldMode: 'hidden',
        },
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),
    createdAt: CREATED_AT(),
    updatedAt: UPDATED_AT(),
  },
  ui: {
    label: '編輯精選',
    labelField: 'labelField',
    listView: {
      initialColumns: ['labelField', 'order'],
      initialSort: { field: 'order', direction: 'ASC' },
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
        const { legislator, topic } = resolvedData
        if (legislator && topic) addValidationError('不能同時選擇委員和議題')
        if (!legislator && !topic) addValidationError('必須選擇委員或議題')
      },
      update: ({ resolvedData, item, addValidationError }) => {
        const { legislator, topic } = resolvedData
        const { legislatorId, topicId } = item

        // Check if we have either current or new relationships
        const hasLegislator =
          !legislator?.disconnect && (legislator || legislatorId)
        const hasTopic = !topic?.disconnect && (topic || topicId)

        // Validate that exactly one option is selected
        if (!hasLegislator && !hasTopic) {
          addValidationError('必須選擇委員或議題') // Must select either legislator or topic
        } else if (hasLegislator && hasTopic) {
          addValidationError('不能同時選擇委員和議題') // Cannot select both legislator and topic
        }
      },
    },
    afterOperation: {
      delete: async ({ originalItem, context }) => {
        const { session } = context
        const { data } = session
        const { id } = originalItem
        console.log(
          JSON.stringify({
            severity: 'INFO',
            message: `Selected Item ID: ${id} Deleted by ${data.name}-${data.email}`,
            context: {
              listKey: 'Selected',
              itemId: id,
              userEmail: data.email,
              userName: data.name,
            },
          })
        )
      },
    },
  },
})

export default listConfigurations
