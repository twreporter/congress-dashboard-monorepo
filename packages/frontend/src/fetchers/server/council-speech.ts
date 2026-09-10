import { keystoneFetch } from '@/app/api/_graphql/keystone'
// type
import type { CouncilSpeechFromRes } from '@/types/council-speech'
import type { SitemapItem } from '@/types'

/** fetchCouncilSpeech
 *  fetch speech with given slug
 */
export const fetchCouncilSpeech = async ({
  slug,
}: {
  slug: string
}): Promise<CouncilSpeechFromRes | undefined> => {
  const where = {
    slug,
  }

  const query = `
    query CouncilSpeech($where: CouncilSpeechWhereUniqueInput!) {
      councilSpeech(where: $where) {
        slug
        date
        title
        councilMember {
          city
          councilor {
            name
            slug
          }
        }
        attendee
        topic {
          title
          slug
          city
        }
        summary
        content
        sourceLink
      }
    }
  `

  const variables = { where }

  try {
    const data = await keystoneFetch<{
      councilSpeech?: CouncilSpeechFromRes
    }>(JSON.stringify({ query, variables }), false)
    if (data.errors) {
      throw new Error(JSON.stringify(data.errors))
    }
    return data?.data?.councilSpeech
  } catch (error) {
    throw new Error(
      `Failed to fetch council speech for slug: ${slug}, err: ${error}`
    )
  }
}

/**
 * fetch all council speeches slug for sitemap
 */
export const fetchAllCouncilSpeechesSlug = async (): Promise<SitemapItem[]> => {
  const query = `
    query GetAllCouncilSpeechesSlug($take: Int, $skip: Int) {
      councilSpeeches(take: $take, skip: $skip) {
        slug
        updatedAt
      }
    }
  `
  const batchSize = 500
  let allSpeeches: SitemapItem[] = []
  let skip = 0
  let fetched = 0

  while (true) {
    const variables = { take: batchSize, skip }
    try {
      const data = await keystoneFetch<{
        councilSpeeches: SitemapItem[]
      }>(JSON.stringify({ query, variables }), false)
      const batch = data?.data?.councilSpeeches ?? []
      allSpeeches = allSpeeches.concat(batch)
      fetched = batch.length
      if (fetched < batchSize) break
      skip += batchSize
    } catch (error) {
      throw new Error(
        `Failed to fetch council speeches slug batch, skip: ${skip}, err: ${error}`
      )
    }
  }
  return allSpeeches
}
