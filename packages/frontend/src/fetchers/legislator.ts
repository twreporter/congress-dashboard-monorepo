'use client'

export type LegislatorWithSpeechCount = {
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
              party {
                image {
                  imageFile {
                    url
                  }
                }
                imageLink
              }
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
  const legislatorCounts = speeches.reduce((acc, speech) => {
    const legislator = speech.legislativeYuanMember?.legislator
    if (!legislator) return acc

    const slug = legislator.slug
    if (!acc[slug]) {
      acc[slug] = {
        ...legislator,
        avatar: legislator.image?.imageFile?.url
          ? `${process.env.NEXT_PUBLIC_IMAGE_HOST}${legislator.image.imageFile.url}`
          : legislator.imageLink,
        partyAvatar: speech.legislativeYuanMember.party?.image?.imageFile?.url
          ? `${process.env.NEXT_PUBLIC_IMAGE_HOST}${speech.legislativeYuanMember.party.image.imageFile.url}`
          : speech.legislativeYuanMember.party.imageLink,
        count: 0,
      }
    }
    acc[slug].count++
    return acc
  }, {})

  // Convert to array, sort by count, and take top 5
  const topLegislators = Object.values(legislatorCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return topLegislators
}
