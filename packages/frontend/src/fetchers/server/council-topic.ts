import { keystoneFetch } from '@/app/api/_graphql/keystone'
// type
import type { CouncilDistrict } from '@/types/council'
import type {
  CouncilTopicFromRes,
  TopNCouncilTopicData,
  FeaturedCouncilTopicData,
} from '@/types/council-topic'
import type { SitemapItemWithCity } from '@/types'
// utils
import { sortByCountDesc } from '@/fetchers/utils'
// lodash
import { get } from 'lodash'
const _ = {
  get,
}

/** fetchATopicName
 *  fetch topic name with given slug & district slug
 */
type TopicTitle = {
  title: string
}
type FetchTopicNameParams = {
  slug: string
  districtSlug: CouncilDistrict
}
export const fetchATopicName = async ({
  slug,
  districtSlug,
}: FetchTopicNameParams): Promise<string> => {
  const where = {
    slug: {
      equals: slug,
    },
    city: {
      equals: districtSlug,
    },
  }
  const query = `
    query TopicTitle($where: CouncilTopicWhereInput!, $take: Int) {
      councilTopics(where: $where, take: $take) {
        title
      }
    }
  `
  const variables = { where, take: 1 }
  try {
    const data = await keystoneFetch<{
      councilTopics: TopicTitle[]
    }>(JSON.stringify({ query, variables }), false)
    return _.get(data, 'data.councilTopics[0].title', '')
  } catch (err) {
    throw new Error(
      `Failed to fetch council topic title for slug: ${slug} in district ${districtSlug}, err: ${err}`
    )
  }
}

/** fetchTopicBySlug
 *  fetch topic with given slug & district slug
 */
type FetchTopicBySlugParams = {
  slug: string
  districtSlug: CouncilDistrict
}
export const fetchTopicBySlug = async ({
  slug,
  districtSlug,
}: FetchTopicBySlugParams): Promise<CouncilTopicFromRes | undefined> => {
  const query = `
    query CouncilTopics($where: CouncilTopicWhereInput!, $billWhere2: CouncilBillWhereInput!, $orderBy: [CouncilBillOrderByInput!]!, $billCountWhere2: CouncilBillWhereInput!) {
      councilTopics(where: $where) {
        billCount(where: $billCountWhere2)
        bill(where: $billWhere2, orderBy: $orderBy) {
          councilMember {
            councilor {
              slug
              name
              image {
                imageFile {
                  url
                }
              }
              imageLink
            }
          }
          summary
          title
          slug
          date
        }
        slug
        title
        city
        relatedTwreporterArticle
        relatedLegislativeTopic {
          slug
          title
        }
        relatedCouncilTopic {
          slug
          title
          city
        }
        relatedCityCouncilTopic {
          slug
          title
        }
      }
    }
  `
  const cityCondition = {
    city: {
      equals: districtSlug,
    },
  }
  const variables = {
    where: {
      slug: {
        equals: slug,
      },
      ...cityCondition,
    },
    billWhere2: {
      councilMeeting: cityCondition,
    },
    billCountWhere2: {
      councilMeeting: cityCondition,
    },
    orderBy: [{ date: 'desc' }],
  }
  try {
    const data = await keystoneFetch<{
      councilTopics: CouncilTopicFromRes[]
    }>(JSON.stringify({ query, variables }), false)
    return _.get(data, 'data.councilTopics[0]')
  } catch (err) {
    throw new Error(
      `Failed to fetch council topic for slug: ${slug} in district ${districtSlug}, err: ${err}`
    )
  }
}

/**
 * fetch all council topics slug for sitemap
 */
export const fetchAllCouncilTopicSlug = async (): Promise<
  SitemapItemWithCity[]
> => {
  const query = `
    query GetAllTopicsSlug($take: Int, $skip: Int) {
      councilTopics(take: $take, skip: $skip) {
        slug
        updatedAt
        city
      }
    }
  `
  const batchSize = 500
  let allTopics: SitemapItemWithCity[] = []
  let skip = 0
  let fetched = 0

  while (true) {
    const variables = { take: batchSize, skip }
    try {
      const data = await keystoneFetch<{
        councilTopics: SitemapItemWithCity[]
      }>(JSON.stringify({ query, variables }), false)
      const batch = data?.data?.councilTopics ?? []
      allTopics = allTopics.concat(batch)
      fetched = batch.length
      if (fetched < batchSize) break
      skip += batchSize
    } catch (error) {
      throw new Error(
        `Failed to fetch council topics slug batch, skip: ${skip}, err: ${error}`
      )
    }
  }
  return allTopics
}

/* fetchTopNTopics
 *   fetch top N topics with give take & skip in given meeting & session
 *   top logic is order by bill count desc
 */
export type FetchTopNTopicsParams = {
  take?: number
  skip?: number
  councilMeetingId: number
  partyIds?: number[]
}

export const fetchTopNCouncilTopics = async ({
  take = 10,
  skip = 0,
  councilMeetingId,
}: FetchTopNTopicsParams): Promise<TopNCouncilTopicData[] | undefined> => {
  const query = `
    query CouncilTopicsOrderByBillCount($meetingId: Int!, $take: Int, $skip: Int) {
      councilTopicsOrderByBillCount(meetingId: $meetingId, take: $take, skip: $skip) {
        councilorCount
        slug
        billCount
        title
        councilors {
          id
          name
          imageLink
          slug
          party
          count
          image {
            imageFile {
              url
            }
          }
        }
      }
    }
  `
  const variables = {
    take,
    skip,
    meetingId: Number(councilMeetingId),
  }

  try {
    const data = await keystoneFetch<{
      councilTopicsOrderByBillCount: TopNCouncilTopicData[]
    }>(JSON.stringify({ query, variables }), false)
    return data?.data?.councilTopicsOrderByBillCount
  } catch (err) {
    throw new Error(
      `Failed to fetch top ${take} council topics in meeting ${councilMeetingId}, err: ${err}`
    )
  }
}

/**
 * Fetch featured council topics (type = 'twreporter') for a city
 * Returns topics with title, slug, billCount, councilorCount, and top 5 councilor avatars
 */
export type FetchFeaturedCouncilTopicsParams = {
  city: CouncilDistrict
}

type CouncilMemberFromRes = {
  councilor: {
    id: number
    slug: string
    name: string
    imageLink?: string
    image?: {
      imageFile?: {
        url?: string
      }
    }
  }
}

type FeaturedCouncilTopicFromRes = {
  title: string
  slug: string
  bill: {
    id: number
    councilMember: CouncilMemberFromRes[]
  }[]
}

const getCouncilorImageUrl = (
  councilor: CouncilMemberFromRes['councilor']
): string => {
  const selfHostImage = councilor?.image?.imageFile?.url
  const fallbackLink = councilor?.imageLink ?? ''
  const imageUrl = selfHostImage
    ? `${process.env.NEXT_PUBLIC_IMAGE_HOST}${selfHostImage}`
    : fallbackLink
  return imageUrl
}

export const fetchFeaturedCouncilTopics = async ({
  city,
}: FetchFeaturedCouncilTopicsParams): Promise<FeaturedCouncilTopicData[]> => {
  const query = `
    query FeaturedCouncilTopics($where: CouncilTopicWhereInput!) {
      councilTopics(where: $where) {
        title
        slug
        bill {
          id
          councilMember {
            councilor {
              id
              slug
              name
              imageLink
              image {
                imageFile {
                  url
                }
              }
            }
          }
        }
      }
    }
  `
  const variables = {
    where: {
      type: { equals: 'twreporter' },
      city: { equals: city },
    },
  }

  try {
    const data = await keystoneFetch<{
      councilTopics: FeaturedCouncilTopicFromRes[]
    }>(JSON.stringify({ query, variables }), false)

    const topics = data?.data?.councilTopics || []

    return topics.map((topic) => {
      // Count unique bills
      const billCount = topic.bill?.length || 0

      // Collect all council members from all bills with their bill count
      const councilorBillCountMap = new Map<
        number,
        { councilor: CouncilMemberFromRes['councilor']; count: number }
      >()

      topic.bill?.forEach((bill) => {
        bill.councilMember?.forEach((member) => {
          const councilorId = member.councilor?.id
          if (councilorId) {
            const existing = councilorBillCountMap.get(councilorId)
            if (existing) {
              existing.count += 1
            } else {
              councilorBillCountMap.set(councilorId, {
                councilor: member.councilor,
                count: 1,
              })
            }
          }
        })
      })

      // Get unique councilor count
      const councilorCount = councilorBillCountMap.size

      // Sort by bill count and get top 5 avatars
      const sortedCouncilors = Array.from(councilorBillCountMap.values())
        .sort(sortByCountDesc)
        .slice(0, 5)

      const avatars = sortedCouncilors
        .map(({ councilor }) => getCouncilorImageUrl(councilor))
        .filter((url) => url !== '')

      return {
        title: topic.title,
        slug: topic.slug,
        city,
        billCount,
        councilorCount,
        avatars,
      }
    })
  } catch (err) {
    throw new Error(
      `Failed to fetch featured council topics for city: ${city}, err: ${err}`
    )
  }
}
