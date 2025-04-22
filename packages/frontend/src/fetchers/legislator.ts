'use client'

import { getImageLink, sortByCountDesc } from '@/fetchers/utils'

/* fetchTopLegislatorsBySpeechCount
 *   fetch top 5 legislators with most speeches of given topic in given term & session
 */
export type LegislatorWithSpeechCount = {
  slug: string
  name: string
  avatar: string
  partyAvatar: string
  count: number
}

export const fetchTopLegislatorsBySpeechCount = async ({
  topicSlug,
  legislativeMeetingTerm,
  legislativeMeetingSessionTerms,
  legislatorSlug,
}: {
  topicSlug: string
  legislativeMeetingTerm: number
  legislativeMeetingSessionTerms: number[]
  legislatorSlug: string
}): Promise<LegislatorWithSpeechCount[]> => {
  const url = process.env.NEXT_PUBLIC_API_URL as string
  const speechesWhere = {
    AND: [
      {
        topics: {
          some: {
            slug: {
              equals: topicSlug,
            },
          },
        },
      },
      {
        legislativeMeeting: {
          term: {
            equals: legislativeMeetingTerm,
          },
        },
      },
      {
        legislativeMeetingSession: {
          term: {
            in: legislativeMeetingSessionTerms,
          },
        },
      },
      {
        legislativeYuanMember: {
          legislator: {
            slug: {
              not: {
                equals: legislatorSlug,
              },
            },
          },
        },
      },
    ],
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query GetTopLegislatorsBySpeechCount($where: SpeechWhereInput!) {
          speeches(where: $where) {
            legislativeYuanMember {
              legislator {
                slug
                name
                image {
                  imageFile {
                    url
                  }
                }
                imageLink
              }
              party {
                image {
                  imageFile {
                    url
                  }
                }
                imageLink
              }
            }
          }
        }
      `,
      variables: {
        where: speechesWhere,
      },
    }),
  })

  if (!res.ok) {
    throw new Error('Failed to fetch top legislators')
  }

  const data = await res.json()
  const speeches = data?.data?.speeches || []

  // Count speeches by legislator
  const legislatorCounts: LegislatorWithSpeechCount[] = speeches.reduce(
    (acc, speech) => {
      const legislator = speech.legislativeYuanMember?.legislator
      if (!legislator) return acc

      const slug = legislator.slug
      if (!acc[slug]) {
        acc[slug] = {
          ...legislator,
          avatar: getImageLink(legislator),
          partyAvatar: getImageLink(speech.legislativeYuanMember.party),
          count: 0,
        }
      }
      acc[slug].count++
      return acc
    },
    {}
  )

  // Convert to array, sort by count, and take top 5
  const topLegislators = Object.values(legislatorCounts)
    .sort(sortByCountDesc)
    .slice(0, 5)

  return topLegislators
}

/* fetchLegislatorsOfATopic
 *   fetch legislators of given topic and sort by speeches count desc
 */
export type LegislatorForFilter = {
  slug: string
  name: string
  imageLink?: string
  image?: { imageFile: { url: string } }
  count: number
}
export const fetchLegislatorsOfATopic = async (topicSlug: string) => {
  const url = process.env.NEXT_PUBLIC_API_URL as string
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query GetLegislatorsWithSpeechCount($where: SpeechWhereInput!) {
          speeches(where: $where) {
            legislativeYuanMember {
              legislator {
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
      `,
      variables: {
        where: {
          topics: {
            some: {
              slug: {
                equals: topicSlug,
              },
            },
          },
        },
      },
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch legislators of a topic: ${topicSlug}`)
  }
  const data = await res.json()

  // group by legislator & sort with speech counts
  const speeches = data?.data?.speeches || []
  const legislatorCounts: { [key: string]: LegislatorForFilter } =
    speeches.reduce((acc, speech) => {
      const legislator = speech.legislativeYuanMember?.legislator
      if (!legislator) return acc

      const slug = legislator.slug
      if (!acc[slug]) {
        acc[slug] = {
          ...legislator,
          avatar: getImageLink(legislator),
          count: 0,
        }
      }
      acc[slug].count++
      return acc
    }, {})
  const legislatorOrderBySpeechCount =
    Object.values(legislatorCounts).sort(sortByCountDesc)

  return legislatorOrderBySpeechCount
}

export default fetchLegislatorsOfATopic
