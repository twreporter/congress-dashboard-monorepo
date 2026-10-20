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
  councilMeetingId: number
}
export const fetchTopicBySlug = async ({
  slug,
  districtSlug,
  councilMeetingId,
}: FetchTopicBySlugParams): Promise<CouncilTopicFromRes | undefined> => {
  const query = `
    query CouncilTopics($where: CouncilTopicWhereInput!, $speechCountWhere: CouncilSpeechWhereInput!, $billCountWhere: CouncilBillWhereInput!) {
      councilTopics(where: $where) {
        speechCount(where: $speechCountWhere)
        billCount(where: $billCountWhere)
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
    speechCountWhere: {
      councilMeeting: { id: { equals: Number(councilMeetingId) } },
    },
    billCountWhere: {
      councilMeeting: { id: { equals: Number(councilMeetingId) } },
    },
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
 * Fetch featured council topics (type = 'twreporter') for a city's latest term
 * Returns topics with title, slug, billCount, speechCount, councilorCount, and
 * top 5 councilor avatars
 */
export type FetchFeaturedCouncilTopicsParams = {
  city: CouncilDistrict
}

export const fetchFeaturedCouncilTopics = async ({
  city,
}: FetchFeaturedCouncilTopicsParams): Promise<FeaturedCouncilTopicData[]> => {
  const query = `
    query FeaturedCouncilTopics($city: String!) {
      featuredCouncilTopics(city: $city) {
        title
        slug
        speechCount
        billCount
        councilorCount
        councilors {
          imageLink
          image {
            imageFile {
              url
            }
          }
        }
      }
    }
  `

  try {
    const data = await keystoneFetch<{
      featuredCouncilTopics: TopNCouncilTopicData[]
    }>(JSON.stringify({ query, variables: { city } }), false)
    if (data.errors?.length) {
      throw new Error(data.errors.map(({ message }) => message).join('; '))
    }

    return (data.data?.featuredCouncilTopics || []).map(
      ({ councilors, ...topic }) => ({
        ...topic,
        city,
        avatars: (councilors || [])
          .map((councilor) => getImageLink(councilor))
          .filter((url) => url !== ''),
      })
    )
  } catch (err) {
    throw new Error(
      `Failed to fetch featured council topics for city: ${city}, err: ${err}`
    )
  }
}
