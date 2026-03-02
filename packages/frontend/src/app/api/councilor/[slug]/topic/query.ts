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
  excludeTopicSlug?: string
  top?: number
}

const fetchTopicsOfACouncilor = async ({
  councilorSlug,
  city,
  excludeTopicSlug,
  top,
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
  if (excludeTopicSlug) {
    variables.where['slug'] = {
      not: {
        equals: excludeTopicSlug,
      },
    }
  }

  const data = await keystoneFetch<{ councilTopics: TopicFromRes[] }>(
    JSON.stringify({ query, variables }),
    false
  )

  const topics = data?.data?.councilTopics || []
  const topicsOrderByCount = topics
    .filter(({ billCount }) => billCount > 0)
    .map(({ billCount, title, slug }) => ({
      slug,
      name: title,
      count: billCount,
    }))
    .sort(sortByCountDesc)
  return top ? topicsOrderByCount.slice(0, top) : topicsOrderByCount
}

export default fetchTopicsOfACouncilor
