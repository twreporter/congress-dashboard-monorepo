import { keystoneFetch } from '@/app/api/_graphql/keystone'
// type
import type { SpeechFromRes } from '@/types/speech'

/** fetchSpeech
 *  fetch speech with given slug
 */
export const fetchSpeech = async ({
  slug,
}: {
  slug: string
}): Promise<SpeechFromRes | undefined> => {
  const where = {
    slug,
  }

  const query = `
    query Speech($where: SpeechWhereUniqueInput!) {
      speech(where: $where) {
        slug
        date
        title
        legislativeYuanMember {
          legislator {
            name
            slug
          }
        }
        attendee
        topics {
          title
          slug
        }
        summary
        content
        ivodLink
      }
    }
  `

  const variables = { where }

  try {
    const data = await keystoneFetch<{
      speech?: SpeechFromRes
    }>(JSON.stringify({ query, variables }), false)
    if (data.errors) {
      throw new Error(JSON.stringify(data.errors))
    }
    return data?.data?.speech
  } catch (error) {
    throw new Error(`Failed to fetch speech for slug: ${slug}, err: ${error}`)
  }
}

/**
 * fetchSpeechGroup
 *  fetch speech group by given title and date
 */
export const fetchSpeechGroup = async ({
  title,
  date,
}: {
  title: string
  date: string
}): Promise<string[]> => {
  const where = {
    title: { equals: title },
    date: { equals: date },
  }
  const orderBy = [{ ivodStartTime: 'asc' }]

  const query = `
    query Speeches($where: SpeechWhereInput!, $orderBy: [SpeechOrderByInput!]!) {
      speeches(where: $where, orderBy: $orderBy) {
        slug
        ivodStartTime
      }
    }
  `

  const variables = { where, orderBy }

  try {
    const data = await keystoneFetch<{
      speeches?: { slug: string; ivodStartTime?: string }[]
    }>(JSON.stringify({ query, variables }), false)
    if (data.errors) {
      throw new Error(JSON.stringify(data.errors))
    }
    const slugs = data?.data?.speeches?.map((speech) => speech.slug) ?? []
    return slugs
  } catch (error) {
    throw new Error(
      `Failed to fetch speech group for title: ${title}, date: ${date}, err: ${error}`
    )
  }
}

/**
 * fetch all speeches slug for sitemap
 */
export const fetchAllSpeechesSlug = async () => {
  const query = `
    query GetAllSpeechesSlug($take: Int, $skip: Int) {
      speeches(take: $take, skip: $skip) {
        slug
        updatedAt
      }
    }
  `
  const batchSize = 500
  let allSpeeches: { slug: string; updatedAt: string }[] = []
  let skip = 0
  let fetched = 0

  while (true) {
    const variables = { take: batchSize, skip }
    try {
      const data = await keystoneFetch<{
        speeches: { slug: string; updatedAt: string }[]
      }>(JSON.stringify({ query, variables }), false)
      const batch = data?.data?.speeches ?? []
      allSpeeches = allSpeeches.concat(batch)
      fetched = batch.length
      if (fetched < batchSize) break
      skip += batchSize
    } catch (error) {
      throw new Error(
        `Failed to fetch speeches slug batch, skip: ${skip}, err: ${error}`
      )
    }
  }
  return allSpeeches
}
