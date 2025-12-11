import { keystoneFetch } from '@/app/api/_graphql/keystone'
// type
import type { BillFromRes } from '@/types/council-bill'
import type { SitemapItem } from '@/types'

/** fetchABill
 *  fetch council bill with given slug
 */
export const fetchBillBySlug = async ({
  slug,
}: {
  slug: string
}): Promise<BillFromRes | undefined> => {
  const where = {
    slug,
  }

  const query = `
    query Bill($where: CouncilBillWhereUniqueInput!) {
      councilBill(where: $where) {
        slug
        date
        title
        summary
        content
        attendee
        sourceLink
        councilMember {
          councilor {
            slug
            name
          }
        }
        topic {
          slug
          title
          city
        }
      }
    }
  `

  const variables = { where }

  try {
    const data = await keystoneFetch<{
      councilBill?: BillFromRes
    }>(JSON.stringify({ query, variables }), false)
    if (data.errors) {
      throw new Error(JSON.stringify(data.errors))
    }
    return data?.data?.councilBill
  } catch (error) {
    throw new Error(
      `Failed to fetch councilBill for slug: ${slug}, err: ${error}`
    )
  }
}

/**
 * fetch all council bills slug for sitemap
 */
export const fetchAllCouncilBillsSlug = async (): Promise<SitemapItem[]> => {
  const query = `
    query GetAllBillsSlug($take: Int, $skip: Int) {
      councilBill(take: $take, skip: $skip) {
        slug
        updatedAt
      }
    }
  `
  const batchSize = 500
  let allBills: SitemapItem[] = []
  let skip = 0
  let fetched = 0

  while (true) {
    const variables = { take: batchSize, skip }
    try {
      const data = await keystoneFetch<{
        councilBill: SitemapItem[]
      }>(JSON.stringify({ query, variables }), false)
      const batch = data?.data?.councilBill ?? []
      allBills = allBills.concat(batch)
      fetched = batch.length
      if (fetched < batchSize) break
      skip += batchSize
    } catch (error) {
      throw new Error(
        `Failed to fetch bills slug batch, skip: ${skip}, err: ${error}`
      )
    }
  }
  return allBills
}
