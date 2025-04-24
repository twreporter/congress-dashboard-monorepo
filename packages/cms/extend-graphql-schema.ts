import { Context } from '.keystone/types'
import type { GraphQLSchema } from 'graphql'
import { mergeSchemas } from '@graphql-tools/schema'
import {
  getTopicsSql,
  getTop5LegislatorSql,
} from './custom-sql/topicsOrderBySpeechCount'
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

const extendGraphqlSchema = (baseSchema: GraphQLSchema) => {
  return mergeSchemas({
    schemas: [baseSchema],
    typeDefs: `
      type ImageFileWithUrlOnly {
        url: String!
      }
      type CustomImage {
        imageFile: ImageFileWithUrlOnly!
      }
      type LegislatorForTopic {
        name: String!
        party: Int
        count: Int
        slug: String!
        imageLink: String
        image: CustomImage
      }
      type TopicWithSpeechCount {
        title: String!
        slug: String!
        speechCount: Int!
        legislatorCount: Int!
        legislators: [LegislatorForTopic]
      }

      type Query {
        """ Get topics order by speech count desc """
        topicsOrderBySpeechCount(meetingId: Int!, sessionIds: [Int] = [], partyIds: [Int] = [], take: Int = 10, skip: Int = 0): [TopicWithSpeechCount]
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
                    url: `/images/${imageId}.${imageExtension}`, // todo: use config in keyston.config
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
      },
    },
  })
}

export default extendGraphqlSchema
