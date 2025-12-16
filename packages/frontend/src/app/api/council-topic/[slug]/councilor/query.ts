import keystoneFetch from '@/app/api/_graphql/keystone'
// utils
import { getImageLink, sortByCountDesc } from '@/fetchers/utils'
// type
import type { KeystoneImage } from '@/types'
import type { CouncilorWithBillCount } from '@/types/councilor'
// lodash
import { isEmpty } from 'lodash'
const _ = {
  isEmpty,
}

type ConcilorFromRes = {
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
  excludeCouncilorSlug: string
  top?: number
}

const fetchTopNCouncilorOfATopic = async ({
  topicSlug,
  city,
  excludeCouncilorSlug,
  top,
}: FetchTopNCouncilorOfATopicParams): Promise<CouncilorWithBillCount[]> => {
  const query = `
    query CouncilMembers($where: CouncilMemberWhereInput!, $billCountWhere2: CouncilBillWhereInput!) {
      councilMembers(where: $where) {
        billCount(where: $billCountWhere2)
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
      councilor: {
        slug: {
          not: {
            equals: excludeCouncilorSlug,
          },
        },
      },
      city: {
        equals: city,
      },
    },
    billCountWhere2: {
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

  const data = await keystoneFetch<{ councilMembers: ConcilorFromRes[] }>(
    JSON.stringify({ query, variables }),
    false
  )

  const councilors = data?.data?.councilMembers || []
  const councilorsOrderByCount = councilors
    .map(({ billCount, councilor }) => ({
      count: billCount,
      slug: councilor.slug,
      name: councilor.name,
      avatar: getImageLink(councilor),
    }))
    .sort(sortByCountDesc)
  return top ? councilorsOrderByCount.slice(0, top) : councilorsOrderByCount
}

export default fetchTopNCouncilorOfATopic
