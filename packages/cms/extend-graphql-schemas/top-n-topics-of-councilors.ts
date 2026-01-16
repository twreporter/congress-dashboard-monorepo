import type { TypedKeystoneContext } from '../types/context'
import { getCouncilMembersSql } from '../custom-sql/topNTopicsOfCouncilors'
import { gql } from 'graphql-tag'

export const topNTopicsOfCouncilorsTypeDefs = gql`
  """
  custom type for topNTopicsOfCouncilors
  """
  type CouncilTopicWithBillCount {
    title: String!
    slug: String!
    name: String!
    count: Int!
  }
  type CouncilMemberWithTopTopics {
    id: Int!
    topics: [CouncilTopicWithBillCount]
  }

  extend type Query {
    """
    Get top N topics of council members order by bill count desc
    """
    topNTopicsOfCouncilMembers(
      councilMemberIds: [Int!]!
      councilMeetingId: Int!
      take: Int = 10
    ): [CouncilMemberWithTopTopics]
  }
`

type TopicForCouncilMember = {
  title: string
  slug: string
  name: string
  count: number
}
type CouncilMemberWithTopTopics = TopicForCouncilMember & {
  councilMemberId: number
}

export const topNTopicsOfCouncilorsResolver = {
  Query: {
    topNTopicsOfCouncilMembers: async (
      _root: unknown,
      {
        councilMemberIds,
        councilMeetingId,
        take,
      }: {
        councilMemberIds: number[]
        councilMeetingId: number
        take?: number
      },
      context: TypedKeystoneContext
    ) => {
      const topics: CouncilMemberWithTopTopics[] =
        await context.prisma.$queryRaw(
          getCouncilMembersSql({ councilMemberIds, councilMeetingId, take })
        )
      type GroupedTopics = {
        [councilMemberId: number]: Array<TopicForCouncilMember>
      }
      const topicsGrouped = topics.reduce(
        (acc: GroupedTopics, { councilMemberId, count, title, ...rest }) => {
          if (!acc[councilMemberId]) {
            acc[councilMemberId] = []
          }
          acc[councilMemberId].push({
            ...rest,
            title,
            name: title,
            count: Number(count),
          })
          return acc
        },
        {} as GroupedTopics
      )

      return councilMemberIds.map((id: number) => ({
        id,
        topics: topicsGrouped[id],
      }))
    },
  },
}
