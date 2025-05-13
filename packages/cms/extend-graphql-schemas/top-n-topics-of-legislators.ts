import { Context } from '.keystone/types'
import { getLegislatorsSql } from '../custom-sql/topNTopicsOfLegislators'
import { gql } from 'graphql-tag'
// lodash
import { groupBy } from 'lodash'
const _ = {
  groupBy,
}

export const topNTopicsOfLegislatorsTypeDefs = gql`
  """
  custom type for topNTopicsOfLegislators
  """
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

  extend type Query {
    """
    Get top N topic of a legislator order by speech cound desc
    """
    topNTopicsOfLegislators(
      legislatorIds: [Int!]!
      meetingId: Int!
      sessionIds: [Int] = []
      take: Int = 10
    ): [LegislatorWIthTopTopics]
  }
`

type TopicForLegislator = {
  title: string
  slug: string
  name: string
  count: number
}
type LegislatorWithTopTopics = TopicForLegislator & {
  legislatorId: number
}

export const topNTopicsOfLegislatorsResolver = {
  Query: {
    topNTopicsOfLegislators: async (
      _root: any,
      {
        legislatorIds,
        meetingId,
        sessionIds,
        take,
      }: {
        legislatorIds: number[]
        meetingId: number
        sessionIds?: number[]
        take?: number
      },
      context: Context
    ) => {
      const topics = await context.prisma.$queryRaw<LegislatorWithTopTopics[]>(
        getLegislatorsSql({ legislatorIds, meetingId, sessionIds, take })
      )
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
}
