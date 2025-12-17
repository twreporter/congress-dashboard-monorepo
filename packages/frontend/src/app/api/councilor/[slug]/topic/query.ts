import keystoneFetch from '@/app/api/_graphql/keystone'
// utils
import { sortByCountDesc } from '@/fetchers/utils'
// type
import type { CouncilTopicForFilter } from '@/types/council-topic'

type TopicFromRes = {
  slug: string
  title: string
  billCount: number
}

type FetchTopicsOfACouncilorParams = {
  councilorSlug: string
  city: string
}

const fetchTopicsOfACouncilor = async ({
  councilorSlug,
  city,
}: FetchTopicsOfACouncilorParams): Promise<CouncilTopicForFilter[]> => {
  const query = `
    query CouncilTopics($where: CouncilTopicWhereInput!, $billCountWhere2: CouncilBillWhereInput!) {
      councilTopics(where: $where) {
        slug
        title
        billCount(where: $billCountWhere2)
      }
    }
  `

  const variables = {
    where: {
      city: {
        equals: city,
      },
    },
    billCountWhere2: {
      councilMember: {
        some: {
          councilor: {
            slug: {
              equals: councilorSlug,
            },
          },
          city: {
            equals: city,
          },
        },
      },
    },
  }

  const data = await keystoneFetch<{ councilTopics: TopicFromRes[] }>(
    JSON.stringify({ query, variables }),
    false
  )

  const topics = data?.data?.councilTopics || []
  const topicsOrderByCount = topics
    .map(({ billCount, title, slug }) => ({
      slug,
      title,
      count: billCount,
    }))
    .sort(sortByCountDesc)
  return topicsOrderByCount
}

export default fetchTopicsOfACouncilor
