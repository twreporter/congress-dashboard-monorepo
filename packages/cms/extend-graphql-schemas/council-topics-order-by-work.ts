import type { TypedKeystoneContext } from '../types/context'
import { gql } from 'graphql-tag'
// custom sql
import {
  getCouncilTopicsSql,
  getCouncilorTopicsSql,
  getTop5CouncilorsSql,
} from '../custom-sql/councilTopicsOrderByWork'

export const councilTopicsOrderByWorkTypeDefs = gql`
  """
  Custom types for councilTopicsOrderByWork
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
  type CouncilTopicWithWorkCounts {
    title: String!
    slug: String!
    type: String
    speechCount: Int!
    billCount: Int!
    councilorCount: Int!
    councilors: [CouncilorForTopic]
  }
  extend type Query {
    """
    Get council topics ordered by speech count, then bill count
    """
    councilTopicsOrderByWork(
      meetingId: Int!
      partyIds: [Int] = []
      take: Int = 10
      skip: Int = 0
    ): [CouncilTopicWithWorkCounts]
    """
    Get one councilor's topics ordered by speech, bill, then related councilor count
    """
    councilorTopicsOrderByWork(
      meetingId: Int!
      councilorSlug: String!
    ): [CouncilTopicWithWorkCounts]
  }
`

type CouncilTopicWithWorkCountsRow = {
  id: number
  title: string
  slug: string
  type?: string
  speechCount: bigint
  billCount: bigint
  councilorCount: bigint
}

type CouncilorTopicWithWorkCountsRow = Omit<CouncilTopicWithWorkCountsRow, 'id'>

const resolveCouncilorTopicsOrderByWork = async (
  _root: any,
  { meetingId, councilorSlug }: { meetingId: number; councilorSlug: string },
  context: TypedKeystoneContext
) => {
  const topics: CouncilorTopicWithWorkCountsRow[] =
    await context.prisma.$queryRaw(
      getCouncilorTopicsSql({ meetingId, councilorSlug })
    )

  return topics.map(({ speechCount, billCount, councilorCount, ...topic }) => ({
    ...topic,
    speechCount: Number(speechCount),
    billCount: Number(billCount),
    councilorCount: Number(councilorCount),
  }))
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

const resolveCouncilTopicsOrderByWork = async (
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
  const topics: CouncilTopicWithWorkCountsRow[] =
    await context.prisma.$queryRaw(
      getCouncilTopicsSql({ meetingId, partyIds, take, skip })
    )
  if (!topics || topics.length === 0) {
    return []
  }
  const topicIds = topics.map(({ id }) => id)
  const top5councilors: CouncilorForTopicRaw[] = await context.prisma.$queryRaw(
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
  return topics.map(
    ({ speechCount, billCount, councilorCount, id, ...rest }) => ({
      ...rest,
      id,
      speechCount: Number(speechCount),
      billCount: Number(billCount),
      councilorCount: Number(councilorCount),
      councilors: top5councilorsGrouped[id],
    })
  )
}

export const councilTopicsOrderByWorkResolver = {
  Query: {
    councilTopicsOrderByWork: resolveCouncilTopicsOrderByWork,
    councilorTopicsOrderByWork: resolveCouncilorTopicsOrderByWork,
  },
}
