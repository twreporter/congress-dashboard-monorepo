export type LegislatorFromRes = {
  slug: string
  party: {
    name: string
    image: {
      imageFile: {
        url: string
      }
    }
    imageLink: string
  }
  note: string
  legislativeMeeting: {
    term: number
  }
  constituency: string
  type: string
  sessionAndCommittee: {
    committee: {
      name: string
    }[]
    legislativeMeetingSession: {
      term: number
    }
  }[]
  legislator: {
    name: string
    slug: string
    image: {
      imageFile: {
        url: string
      }
    }
    imageLink: string
  }
}

export const fetchLegislator = async ({
  slug,
  legislativeMeeting,
}: {
  slug: string
  legislativeMeeting: number
}): Promise<LegislatorFromRes> => {
  const url = process.env.NEXT_PUBLIC_API_URL as string

  const where = {
    legislator: {
      slug: {
        equals: slug,
      },
    },
    legislativeMeeting: {
      term: {
        equals: legislativeMeeting,
      },
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query LegislativeYuanMembers($where: LegislativeYuanMemberWhereInput!) {
  legislativeYuanMembers(where: $where) {
    party {
      name
      image {
        imageFile {
          url
        }
      }
      imageLink
    }
    note
    legislativeMeeting {
      term
    }
    constituency
    type
    legislator {
      name
      slug
      image {
        imageFile {
          url
        }
      }
      imageLink
    }
    sessionAndCommittee {
      committee {
        name
      }
      legislativeMeetingSession {
        term
      }
    }
  }
}`,
      variables: { where },
    }),
  })

  if (!res.ok) {
    throw new Error('Failed to fetch legislator data')
  }

  const data = await res.json()
  return data?.data?.legislativeYuanMembers?.[0]
}

export type SpeechData = {
  slug: string
  title: string
  date: string
  summary: string
}

export type TopicData = {
  title: string
  slug: string
  speechesCount: number
  speeches: SpeechData[]
}

export const fetchLegislatorTopics = async ({
  slug,
  legislativeMeetingTerm,
  legislativeMeetingSessionTerms,
}: {
  slug: string
  legislativeMeetingTerm: number
  legislativeMeetingSessionTerms: number[]
}): Promise<TopicData[]> => {
  const url = process.env.NEXT_PUBLIC_API_URL as string

  // Create where conditions for topics
  const where = {
    speeches: {
      some: {
        legislativeYuanMember: {
          legislator: {
            slug: {
              equals: slug,
            },
          },
        },
        legislativeMeeting: {
          term: {
            equals: legislativeMeetingTerm,
          },
        },
        legislativeMeetingSession: {
          term: {
            in: legislativeMeetingSessionTerms,
          },
        },
      },
    },
  }

  // Create the speech condition for the speechesCount
  const speechCondition = {
    legislativeYuanMember: {
      legislator: {
        slug: { equals: slug },
      },
    },
    legislativeMeeting: {
      term: { equals: legislativeMeetingTerm },
    },
    legislativeMeetingSession: {
      term: { in: legislativeMeetingSessionTerms },
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query TopicsByLegislator($where: TopicWhereInput!, $speechCondition: SpeechWhereInput!) {
        topics(where: $where) {
          title
          slug
          speechesCount(where: $speechCondition)
          speeches(where: $speechCondition) {
            slug
            date
            title
            summary
          }
        }
      }`,
      variables: {
        where,
        speechCondition,
      },
    }),
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch topics for legislator for slug: ${slug}`)
  }

  const data = await res.json()
  return data?.data?.topics
}
