import { list, graphql } from '@keystone-6/core'
import { relationship, integer, virtual } from '@keystone-6/core/fields'
import { allowAllRoles } from './utils/access-control-list'
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
    createdAt: CREATED_AT,
    updatedAt: UPDATED_AT,
  },
  ui: {
    label: '編輯精選',
    labelField: 'labelField',
    listView: {
      initialColumns: ['labelField', 'order'],
      initialSort: { field: 'order', direction: 'ASC' },
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
