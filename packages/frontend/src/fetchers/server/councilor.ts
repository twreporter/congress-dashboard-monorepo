import { keystoneFetch } from '@/app/api/_graphql/keystone'
// utils
import { isValidCouncil } from '@/utils/council'
// types
import type { CouncilDistrict } from '@/types/council'
import type {
  CouncilorMemberMeta,
  CouncilorMemberData,
} from '@/types/councilor'
import type { CouncilTopicForFilter } from '@/types/council-topic'
import type { SitemapItemWithCity } from '@/types'
import { COUNCIL_TOPIC_TYPE } from '@twreporter/congress-dashboard-shared/lib/constants/council-topic'
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
        speechCount
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
          id
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

type CouncilTopicFromRes = {
  slug: string
  title: string
  type?: string
  speechCount: number
  billCount: number
  councilorCount: number
}

/** Fetch the current council member's topics in dashboard order. */
type FetchCouncilorTopicsParams = {
  slug: string
  districtSlug: CouncilDistrict
  councilMeetingId: number
}
export const fetchCouncilorTopics = async ({
  slug,
  districtSlug,
  councilMeetingId,
}: FetchCouncilorTopicsParams): Promise<CouncilTopicForFilter[]> => {
  const normalizedMeetingId = Number(councilMeetingId)
  if (!Number.isInteger(normalizedMeetingId)) {
    throw new Error(`Invalid council meeting ID: ${councilMeetingId}`)
  }

  const variables = {
    councilorSlug: slug,
    meetingId: normalizedMeetingId,
  }
  const query = `
    query CouncilorTopics($councilorSlug: String!, $meetingId: Int!) {
      councilorTopicsOrderByWork(councilorSlug: $councilorSlug, meetingId: $meetingId) {
        slug
        title
        type
        speechCount
        billCount
        councilorCount
      }
    }
  `
  try {
    const data = await keystoneFetch<{
      councilorTopicsOrderByWork: CouncilTopicFromRes[]
    }>(JSON.stringify({ query, variables }), false)
    return (data?.data?.councilorTopicsOrderByWork || []).map(
      ({ slug: topicSlug, title, speechCount, type }) => ({
        slug: topicSlug,
        name: title,
        count: speechCount,
        isFeatured: type === COUNCIL_TOPIC_TYPE.twreporter,
      })
    )
  } catch (err) {
    throw new Error(
      `Failed to fetch councilor topics for slug: ${slug} in district ${districtSlug}, err: ${err}`
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
