import { Context } from '.keystone/types'
import type { GraphQLSchema } from 'graphql'
import { mergeSchemas } from '@graphql-tools/schema'
// custom sql
import {
  recentSpeechTopicStatsTypeDefs,
  recentSpeechTopicStatsResolvers,
} from './recent-speech-topic-stats'
import {
  topicsOrderBySpeechCountTypeDefs,
  topicsOrderBySpeechCountResolver,
} from './topics-order-by-speech-count'
import { getLegislatorsSql } from '../custom-sql/topNTopicsOfLegislators'
// lodash
import { groupBy } from 'lodash'
const _ = {
  groupBy,
}

type TopicForLegislator = {
  title: string
  slug: string
  name: string
  count: number
}
type LegislatorWithTopTopics = TopicForLegislator & {
  legislatorId: number
}

const extendGraphqlSchema = (baseSchema: GraphQLSchema) => {
  return mergeSchemas({
    schemas: [baseSchema],
    typeDefs: [
      `
      """ custom type for topNTopicsOfLegislators """
      type TopicWithSpeechCount {
        title: String!
        slug: String!
        name: String!
        count: Int!
      }
      type LegislatorWIthTopTopics {
        id: Int!
        topics: [TopicWithSpeechCount]
      }

      type Query {
        """ Get top N topic of a legislator order by speech cound desc """
        topNTopicsOfLegislators(legislatorIds: [Int!]!, meetingId: Int!, sessionIds: [Int] = [], take: Int = 10): [LegislatorWIthTopTopics]
      }
    `,
      recentSpeechTopicStatsTypeDefs,
      topicsOrderBySpeechCountTypeDefs,
    ],
    resolvers: [
      {
        Query: {
          topNTopicsOfLegislators: async (
            _root,
            { legislatorIds, meetingId, sessionIds, take },
            context: Context
          ) => {
            const topics = await context.prisma.$queryRaw<
              LegislatorWithTopTopics[]
            >(getLegislatorsSql({ legislatorIds, meetingId, sessionIds, take }))
            type GroupedTopics = {
              [legislatorId: number]: Array<TopicForLegislator>
            }
            const topicsGrouped = topics.reduce(
              (acc: GroupedTopics, { legislatorId, count, title, ...rest }) => {
                if (!acc[legislatorId]) {
                  acc[legislatorId] = []
                }
                acc[legislatorId].push({
                  ...rest,
                  title,
                  name: title,
                  count: Number(count),
                })
                return acc
              },
              {} as GroupedTopics
            )

            return legislatorIds.map((id: number) => ({
              id,
              topics: topicsGrouped[id],
            }))
          },
        },
      },
      recentSpeechTopicStatsResolvers,
      topicsOrderBySpeechCountResolver,
    ],
  })
}

export default extendGraphqlSchema
