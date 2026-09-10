import keystoneFetch from '@/app/api/_graphql/keystone'
// utils
import { getImageLink } from '@/fetchers/utils'
// type
import type { KeystoneImage } from '@/types'
import type { CouncilorWithWorkCounts } from '@/types/councilor'
// lodash
import { isEmpty } from 'lodash'
const _ = {
  isEmpty,
}

type CouncilorFromRes = {
  speechCount: number
  billCount: number
  councilor: {
    slug: string
    name: string
    image?: KeystoneImage
    imageLink?: string
  }
}

type FetchTopNCouncilorOfATopicParams = {
  topicSlug: string
  city: string
  excludeCouncilorSlug?: string
  top?: number
}

const fetchTopNCouncilorOfATopic = async ({
  topicSlug,
  city,
  excludeCouncilorSlug,
  top,
}: FetchTopNCouncilorOfATopicParams): Promise<CouncilorWithWorkCounts[]> => {
  const query = `
    query CouncilMembers($where: CouncilMemberWhereInput!, $speechCountWhere: CouncilSpeechWhereInput!, $billCountWhere: CouncilBillWhereInput!) {
      councilMembers(where: $where) {
        speechCount(where: $speechCountWhere)
        billCount(where: $billCountWhere)
        councilor {
          name
          slug
          image {
            imageFile {
              url
            }
          }
          imageLink
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
      topic: {
        some: {
          slug: {
            equals: topicSlug,
          },
        },
      },
      councilMember: {
        some: {
          city: {
            equals: city,
          },
        },
      },
    },
    billCountWhere: {
      topic: {
        some: {
          slug: {
            equals: topicSlug,
          },
        },
      },
      councilMember: {
        some: {
          city: {
            equals: city,
          },
        },
      },
    },
  }
  if (excludeCouncilorSlug) {
    variables.where['councilor'] = {
      slug: {
        not: {
          equals: excludeCouncilorSlug,
        },
      },
    }
  }

  const data = await keystoneFetch<{ councilMembers: CouncilorFromRes[] }>(
    JSON.stringify({ query, variables }),
    false
  )

  const councilors = data?.data?.councilMembers || []
  const councilorsBySlug = councilors.reduce<Map<string, CouncilorFromRes>>(
    (result, item) => {
      const existing = result.get(item.councilor.slug)
      if (existing) {
        existing.speechCount += item.speechCount
        existing.billCount += item.billCount
      } else {
        result.set(item.councilor.slug, { ...item })
      }
      return result
    },
    new Map()
  )
  const councilorsOrderByCount = Array.from(councilorsBySlug.values())
    .filter(({ speechCount, billCount }) => speechCount > 0 || billCount > 0)
    .sort(
      (a, b) =>
        b.speechCount - a.speechCount ||
        b.billCount - a.billCount ||
        a.councilor.slug.localeCompare(b.councilor.slug)
    )
    .map(({ speechCount, billCount, councilor }) => ({
      speechCount,
      billCount,
      slug: councilor.slug,
      name: councilor.name,
      avatar: getImageLink(councilor),
    }))
  return top ? councilorsOrderByCount.slice(0, top) : councilorsOrderByCount
}

export default fetchTopNCouncilorOfATopic
