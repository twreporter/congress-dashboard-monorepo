import { keystoneFetch } from '@/app/api/_graphql/keystone'
// utils
import { isValidCouncil } from '@/utils/council'
// types
import type { CouncilDistrict } from '@/types/council'
import type {
  CouncilorMemberMeta,
  CouncilorMemberData,
} from '@/types/councilor'
import type { CouncilTopicOfBillData } from '@/types/council-topic'
import type { SitemapItemWithCity } from '@/types'
// lodash
import { get } from 'lodash'
const _ = {
  get,
}

/** fetchCouncilorName
 *  fetch councilor's name with given slug & district slug
 */
type FetchCouncilorNameParams = {
  slug: string
  districtSlug: CouncilDistrict
}
export const fetchCouncilorName = async ({
  slug,
  districtSlug,
}: FetchCouncilorNameParams): Promise<string> => {
  const where = {
    councilor: {
      slug: {
        equals: slug,
      },
    },
    city: {
      equals: districtSlug,
    },
  }
  const query = `
    query CouncilMembers($where: CouncilMemberWhereInput!) {
      councilMembers(where: $where) {
        councilor {
          name
        }
      }
    }
  `
  const variables = { where }
  try {
    const data = await keystoneFetch<{
      councilMembers: CouncilorMemberMeta[]
    }>(JSON.stringify({ query, variables }), false)
    return _.get(data, 'data.councilMembers[0].councilor.name', '')
  } catch (err) {
    throw new Error(
      `Failed to fetch councilor meta for slug: ${slug} in district ${districtSlug}, err: ${err}`
    )
  }
}

/** fetchCouncilor
 *  fetch councilor' data with given slug & district slug
 */
type FetchCouncilorParams = {
  slug: string
  districtSlug: CouncilDistrict
}
export const fetchCouncilor = async ({
  slug,
  districtSlug,
}: FetchCouncilorParams): Promise<CouncilorMemberData | undefined> => {
  const where = {
    councilor: {
      slug: {
        equals: slug,
      },
    },
    city: {
      equals: districtSlug,
    },
  }
  const query = `
    query CouncilMembers($where: CouncilMemberWhereInput!) {
      councilMembers(where: $where) {
        councilor {
          name
          image {
            imageFile {
              url
            }
          }
          imageLink
          externalLink
          meetingTermCount
          meetingTermCountInfo
        }
        councilMeeting {
          term
          city
        }
        party {
          name
          imageLink
          image {
            imageFile {
              url
            }
          }
        }
        administrativeDistrict
        constituency
        isActive
        note
        proposalSuccessCount
        relatedLink
        tooltip
        type
      }
    }
  `
  const variables = { where }
  try {
    const data = await keystoneFetch<{
      councilMembers: CouncilorMemberData[]
    }>(JSON.stringify({ query, variables }), false)
    return _.get(data, 'data.councilMembers[0]')
  } catch (err) {
    throw new Error(
      `Failed to fetch councilor for slug: ${slug} in district ${districtSlug}, err: ${err}`
    )
  }
}

/** fetchCouncilorTopics
 *  fetch councilor's topics with given slug & district slug
 */
type FetchCouncilorTopicsOfBillParams = {
  slug: string
  districtSlug: CouncilDistrict
}
export const fetchCouncilorTopicsOfBill = async ({
  slug,
  districtSlug,
}: FetchCouncilorTopicsOfBillParams): Promise<CouncilTopicOfBillData[]> => {
  const condition = {
    councilMember: {
      some: {
        city: {
          equals: districtSlug,
        },
        councilor: {
          slug: {
            equals: slug,
          },
        },
      },
    },
  }
  const variables = {
    where: {
      bill: {
        some: condition,
      },
    },
    billWhere2: condition,
    billCountWhere2: condition,
    orderBy: [{ date: 'desc' }],
  }
  const query = `
    query CouncilTopicsOfBill($where: CouncilTopicWhereInput!, $billCountWhere2: CouncilBillWhereInput!, $billWhere2: CouncilBillWhereInput!, $orderBy: [CouncilBillOrderByInput!]!) {
      councilTopics(where: $where) {
        billCount(where: $billCountWhere2)
        bill(where: $billWhere2, orderBy: $orderBy) {
          date
          summary
          title
          slug
        }
        slug
        title
      }
    }
  `
  try {
    const data = await keystoneFetch<{
      councilTopics: CouncilTopicOfBillData[]
    }>(JSON.stringify({ query, variables }), false)
    return data?.data?.councilTopics || []
  } catch (err) {
    throw new Error(
      `Failed to fetch councilor topics of bill for slug: ${slug} in district ${districtSlug}, err: ${err}`
    )
  }
}

/**
 * fetch all councilors slug for sitemap
 */
type CouncilorFromRes = {
  updatedAt: string
  city: string
  councilor: {
    slug: string
  }
}
export const fetchAllCouncilorSlug = async (): Promise<
  SitemapItemWithCity[]
> => {
  const query = `
    query GetAllCouncilorSlug($take: Int, $skip: Int) {
      councilMembers(take: $take, skip: $skip) {
        updatedAt
        city
        councilor {
          slug
        }
      }
    }
  `
  const batchSize = 500
  let allCouncilors: SitemapItemWithCity[] = []
  let skip = 0
  let fetched = 0

  while (true) {
    const variables = { take: batchSize, skip }
    try {
      const data = await keystoneFetch<{
        councilMembers: CouncilorFromRes[]
      }>(JSON.stringify({ query, variables }), false)
      const batch = data?.data?.councilMembers ?? []
      const councilors = batch
        .filter(({ city }) => isValidCouncil(city))
        .map(({ councilor, city, ...res }) => ({
          slug: councilor.slug,
          city: city as CouncilDistrict,
          ...res,
        }))
      allCouncilors = allCouncilors.concat(councilors)
      fetched = batch.length
      if (fetched < batchSize) break
      skip += batchSize
    } catch (error) {
      throw new Error(
        `Failed to fetch councilor slug batch, skip: ${skip}, err: ${error}`
      )
    }
  }
  return allCouncilors
}
