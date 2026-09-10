import { keystoneFetch } from '@/app/api/_graphql/keystone'
// type
import type { CouncilDistrict } from '@/types/council'
import type {
  CouncilTopicFromRes,
  TopNCouncilTopicData,
  FeaturedCouncilTopicData,
} from '@/types/council-topic'
import type { SitemapItemWithCity, KeystoneImage } from '@/types'
// utils
import { getImageLink } from '@/fetchers/utils'
// @twreporter
import { COUNCIL_TOPIC_TYPE } from '@twreporter/congress-dashboard-shared/lib/constants/council-topic'
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
          summaryFallback
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
          type
          billCount
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
    const topic = _.get(data, 'data.councilTopics[0]')
    if (topic?.relatedCityCouncilTopic) {
      const sortByBillCountDesc = (
        a: { billCount?: number },
        b: { billCount?: number }
      ) => (b.billCount ?? 0) - (a.billCount ?? 0)

      const twreporterTopics = topic.relatedCityCouncilTopic
        .filter((t) => t.type === COUNCIL_TOPIC_TYPE.twreporter)
        .sort(sortByBillCountDesc)
      const generalTopics = topic.relatedCityCouncilTopic
        .filter((t) => t.type !== COUNCIL_TOPIC_TYPE.twreporter)
        .sort(sortByBillCountDesc)

      topic.relatedCityCouncilTopic = [...twreporterTopics, ...generalTopics]
    }
    return topic
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
 *   top logic is order by speech count, then bill count desc
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
    query CouncilTopicsOrderByWork($meetingId: Int!, $take: Int, $skip: Int) {
      councilTopicsOrderByWork(meetingId: $meetingId, take: $take, skip: $skip) {
        councilorCount
        slug
        speechCount
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
      councilTopicsOrderByWork: TopNCouncilTopicData[]
    }>(JSON.stringify({ query, variables }), false)
    return data?.data?.councilTopicsOrderByWork
  } catch (err) {
    throw new Error(
      `Failed to fetch top ${take} council topics in meeting ${councilMeetingId}, err: ${err}`
    )
  }
}

/**
 * Fetch featured council topics (type = 'twreporter') for a city
 * Returns topics with title, slug, billCount, speechCount, councilorCount, and
 * top 5 councilor avatars
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
    image?: KeystoneImage
  }
}

type FeaturedCouncilTopicFromRes = {
  title: string
  slug: string
  bill: {
    id: number
    councilMember: CouncilMemberFromRes[]
  }[]
  speech: {
    id: number
    councilMember: CouncilMemberFromRes[]
  }[]
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
        speech {
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

    return topics
      .map((topic) => {
        const billCount = topic.bill?.length ?? 0
        const speechCount = topic.speech?.length ?? 0

        // Collect the union of councilors from bills and speeches, along with
        // their unique participation counts for avatar ranking.
        const councilorCountMap = new Map<
          number,
          {
            councilor: CouncilMemberFromRes['councilor']
            billIds: Set<number>
            speechIds: Set<number>
          }
        >()

        topic.bill?.forEach((bill) => {
          bill.councilMember?.forEach((member) => {
            const councilorId = member.councilor?.id
            if (councilorId !== undefined) {
              const existing = councilorCountMap.get(councilorId)
              if (existing) {
                existing.billIds.add(bill.id)
              } else {
                councilorCountMap.set(councilorId, {
                  councilor: member.councilor,
                  billIds: new Set([bill.id]),
                  speechIds: new Set(),
                })
              }
            }
          })
        })

        topic.speech?.forEach((speech) => {
          speech.councilMember?.forEach((member) => {
            const councilor = member.councilor
            const councilorId = councilor?.id
            if (councilorId !== undefined && councilor) {
              const existing = councilorCountMap.get(councilorId)
              if (existing) {
                existing.speechIds.add(speech.id)
              } else {
                councilorCountMap.set(councilorId, {
                  councilor,
                  billIds: new Set(),
                  speechIds: new Set([speech.id]),
                })
              }
            }
          })
        })

        const councilorCount = councilorCountMap.size

        // Prioritize speech participation, then bill participation.
        const sortedCouncilors = Array.from(councilorCountMap.values())
          .sort(
            (a, b) =>
              b.speechIds.size - a.speechIds.size ||
              b.billIds.size - a.billIds.size
          )
          .slice(0, 5)

        const avatars = sortedCouncilors
          .map(({ councilor }) => getImageLink(councilor))
          .filter((url) => url !== '')

        return {
          title: topic.title,
          slug: topic.slug,
          city,
          billCount,
          speechCount,
          councilorCount,
          avatars,
        }
      })
      .sort(
        (a, b) =>
          b.speechCount - a.speechCount ||
          b.billCount - a.billCount ||
          b.councilorCount - a.councilorCount
      )
  } catch (err) {
    throw new Error(
      `Failed to fetch featured council topics for city: ${city}, err: ${err}`
    )
  }
}
