import keystoneFetch from '@/app/api/_graphql/keystone'
// type
import type { CouncilTopicForFilter } from '@/types/council-topic'
// constants
import { COUNCIL_TOPIC_TYPE } from '@twreporter/congress-dashboard-shared/lib/constants/council-topic'

type TopicFromRes = {
  slug: string
  title: string
  type?: string
  speechCount: number
  billCount: number
  speech: Array<{
    councilMember: Array<{ councilor?: { slug: string } }>
  }>
  bill: Array<{ councilMember: Array<{ councilor?: { slug: string } }> }>
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
    query CouncilTopics($where: CouncilTopicWhereInput!, $speechCountWhere: CouncilSpeechWhereInput!, $billCountWhere: CouncilBillWhereInput!, $speechWhere: CouncilSpeechWhereInput!, $billWhere: CouncilBillWhereInput!, $councilMemberWhere: CouncilMemberWhereInput!) {
      councilTopics(where: $where) {
        slug
        title
        type
        speechCount(where: $speechCountWhere)
        billCount(where: $billCountWhere)
        speech(where: $speechWhere) {
          councilMember(where: $councilMemberWhere) {
            councilor { slug }
          }
        }
        bill(where: $billWhere) {
          councilMember(where: $councilMemberWhere) {
            councilor { slug }
          }
        }
      }
    }
  `

  const variables = {
    where: {
      city: {
        equals: city,
      },
    },
    speechCountWhere: {
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
    billCountWhere: {
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
    speechWhere: {
      councilMember: {
        some: {
          city: {
            equals: city,
          },
        },
      },
    },
    billWhere: {
      councilMember: {
        some: {
          city: {
            equals: city,
          },
        },
      },
    },
    councilMemberWhere: {
      city: {
        equals: city,
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
    .filter(({ speechCount, billCount }) => speechCount > 0 || billCount > 0)
    .map((topic) => {
      const relatedCouncilors = new Set<string>()
      topic.speech.forEach(({ councilMember }) => {
        councilMember.forEach(({ councilor }) => {
          if (councilor?.slug) relatedCouncilors.add(councilor.slug)
        })
      })
      topic.bill.forEach(({ councilMember }) => {
        councilMember.forEach(({ councilor }) => {
          if (councilor?.slug) relatedCouncilors.add(councilor.slug)
        })
      })
      return { ...topic, relatedCouncilorCount: relatedCouncilors.size }
    })
    .sort(
      (a, b) =>
        b.speechCount - a.speechCount ||
        b.billCount - a.billCount ||
        b.relatedCouncilorCount - a.relatedCouncilorCount ||
        a.slug.localeCompare(b.slug)
    )
    .map(({ speechCount, title, slug, type }) => ({
      slug,
      name: title,
      count: speechCount,
      isFeatured: type === COUNCIL_TOPIC_TYPE.twreporter,
    }))
  return top ? topicsOrderByCount.slice(0, top) : topicsOrderByCount
}

export default fetchTopicsOfACouncilor
