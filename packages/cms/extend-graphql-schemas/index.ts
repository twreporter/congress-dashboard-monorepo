import { Context } from '.keystone/types'
import type { GraphQLSchema } from 'graphql'
import { mergeSchemas } from '@graphql-tools/schema'
// custom sql
import {
  getTopicsSql,
  getTop5LegislatorSql,
} from '../custom-sql/topicsOrderBySpeechCount'
import { getLegislatorsSql } from '../custom-sql/topNTopicsOfLegislators'
// lodash
import { groupBy } from 'lodash'
const _ = {
  groupBy,
}

type TopicWithSpeechCount = {
  id: number
  title: string
  slug: string
  speechCount: bigint
  legislatorCount: bigint
}
type LegislatorForTopic = {
  id: number
  slug: string
  name: string
  count?: number
  party?: number
  imageLink?: string
  image?: {
    imageFile: {
      url: string
    }
  }
}
type LegislatorForTopicRaw = LegislatorForTopic & {
  topicId: number
  imageId?: number
  imageExtension?: string
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
    typeDefs: `
      """ custom type for topicsOrderBySpeechCount """
      type ImageFileWithUrlOnly {
        url: String!
      }
      type CustomImage {
        imageFile: ImageFileWithUrlOnly!
      }
      type LegislatorForTopic {
        id: Int!
        name: String!
        party: Int
        count: Int
        slug: String!
        imageLink: String
        image: CustomImage
      }
      type TopicWithSpeechCountAndLegislators {
        title: String!
        slug: String!
        speechCount: Int!
        legislatorCount: Int!
        legislators: [LegislatorForTopic]
      }
      
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
        """ Get topics order by speech count desc """
        topicsOrderBySpeechCount(meetingId: Int!, sessionIds: [Int] = [], partyIds: [Int] = [], take: Int = 10, skip: Int = 0): [TopicWithSpeechCountAndLegislators]
        """ Get top N topic of a legislator order by speech cound desc """
        topNTopicsOfLegislators(legislatorIds: [Int!]!, meetingId: Int!, sessionIds: [Int] = [], take: Int = 10): [LegislatorWIthTopTopics]
      }
    `,
    resolvers: {
      Query: {
        topicsOrderBySpeechCount: async (
          _root,
          { meetingId, sessionIds, partyIds, take, skip },
          context: Context
        ) => {
          const topics = await context.prisma.$queryRaw<TopicWithSpeechCount[]>(
            getTopicsSql({ meetingId, sessionIds, partyIds, take, skip })
          )
          if (!topics || topics.length === 0) {
            return []
          }
          const topicIds = topics.map(({ id }) => id)
          const top5legislators = await context.prisma.$queryRaw<
            LegislatorForTopicRaw[]
          >(getTop5LegislatorSql({ meetingId, sessionIds, partyIds, topicIds }))
          type GroupedLegislators = {
            [topicId: number]: Array<LegislatorForTopic>
          }
          const top5legislatorsGrouped = top5legislators.reduce(
            (
              acc: GroupedLegislators,
              { count, topicId, imageId, imageExtension, ...rest }
            ) => {
              if (!acc[topicId]) {
                acc[topicId] = []
              }
              let image
              if (imageId && imageExtension) {
                image = {
                  imageFile: {
                    url: `/images/${imageId}.${imageExtension}`, // todo: use config in keystone.config
                  },
                }
              }
              const res = {
                ...rest,
                count: Number(count),
                image,
              }
              acc[topicId].push(res)
              return acc
            },
            {} as GroupedLegislators
          )
          return topics.map(
            ({ speechCount, legislatorCount, id, ...rest }) => ({
              ...rest,
              id,
              speechCount: Number(speechCount),
              legislatorCount: Number(legislatorCount),
              legislators: top5legislatorsGrouped[id],
            })
          )
        },
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
  })
}

export default extendGraphqlSchema
