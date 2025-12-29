import { keystoneFetch } from '@/app/api/_graphql/keystone'
// type
import type { CouncilDistrict } from '@/types/council'
import type { CouncilTopicFromRes } from '@/types/council-topic'
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
    where: cityCondition,
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
