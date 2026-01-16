import type { TypedKeystoneContext } from '../types/context'
import { gql } from 'graphql-tag'
// custom sql
import {
  getCouncilTopicsSql,
  getTop5CouncilorsSql,
} from '../custom-sql/councilTopicsOrderBySpeechCount'

export const councilTopicsOrderBySpeechCountTypeDefs = gql`
  """
  custom type for councilTopicsOrderBySpeechCount
  """
  type CouncilorForTopic {
    id: Int!
    name: String!
    party: Int
    count: Int
    slug: String!
    imageLink: String
    image: CustomImage
  }
  type CouncilTopicWithBillCountAndCouncilors {
    title: String!
    slug: String!
    billCount: Int!
    councilorCount: Int!
    councilors: [CouncilorForTopic]
  }
  extend type Query {
    """
    Get council topics order by bill count desc
    """
    councilTopicsOrderBySpeechCount(
      meetingId: Int!
      partyIds: [Int] = []
      take: Int = 10
      skip: Int = 0
    ): [CouncilTopicWithBillCountAndCouncilors]
  }
`

type CouncilTopicWithBillCount = {
  id: number
  title: string
  slug: string
  billCount: bigint
  councilorCount: bigint
}

type CouncilorForTopic = {
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

type CouncilorForTopicRaw = CouncilorForTopic & {
  topicId: number
  imageId?: number
  imageExtension?: string
}

export const councilTopicsOrderBySpeechCountResolver = {
  Query: {
    councilTopicsOrderBySpeechCount: async (
      _root: any,
      {
        meetingId,
        partyIds,
        take,
        skip,
      }: {
        meetingId: number
        partyIds?: number[]
        take?: number
        skip?: number
      },
      context: TypedKeystoneContext
    ) => {
      const topics: CouncilTopicWithBillCount[] =
        await context.prisma.$queryRaw(
          getCouncilTopicsSql({ meetingId, partyIds, take, skip })
        )
      if (!topics || topics.length === 0) {
        return []
      }
      const topicIds = topics.map(({ id }) => id)
      const top5councilors: CouncilorForTopicRaw[] =
        await context.prisma.$queryRaw(
          getTop5CouncilorsSql({
            meetingId,
            partyIds,
            topicIds,
          })
        )
      type GroupedCouncilors = {
        [topicId: number]: Array<CouncilorForTopic>
      }
      const top5councilorsGrouped = top5councilors.reduce(
        (
          acc: GroupedCouncilors,
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
        {} as GroupedCouncilors
      )
      return topics.map(({ billCount, councilorCount, id, ...rest }) => ({
        ...rest,
        id,
        billCount: Number(billCount),
        councilorCount: Number(councilorCount),
        councilors: top5councilorsGrouped[id],
      }))
    },
  },
}
