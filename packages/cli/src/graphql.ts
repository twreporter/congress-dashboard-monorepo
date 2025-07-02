import type { AxiosResponse } from 'axios'
import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config()

// Ensure the GraphQL endpoint is set in environment variables
if (!process.env.GRAPHQL_ENDPOINT) {
  throw new Error('GRAPHQL_ENDPOINT is not set in .env')
}

// Headless system account credentials for authentication
const headlessAccount = {
  email: process.env.HEADLESS_ACCOUNT_EMAIL,
  password: process.env.HEADLESS_ACCOUNT_PASSWORD,
}
const apiEndpoint = process.env.GRAPHQL_ENDPOINT

// Type definitions for topic-related speech counts
type MemberSpeechCount = {
  memberId: string
  name: string
  count: number
}

// Type for basic topic information
type TopicInfo = {
  id: string
  slug: string
  title: string
  lastSpeechAt: string // ISO 8601 formatted date string
  meetingTerm: number
  sessionTerm: number
}

// Composite model for topic statistics
export type TopicModel = {
  topicInfo: TopicInfo
  distinctMemberCount: number
  members: MemberSpeechCount[]
}

// Legislator data structure
export type LegislatorModel = {
  id: string
  note: string
  constituency?: string
  legislator: {
    name: string
    slug: string
    imageLink?: string
  }
  party?: {
    name: string
    imageLink?: string
    image?: {
      imageFile: {
        url: string
      }
    }
  }
  legislativeMeeting: {
    term: number
  }
  speeches: {
    date: string
  }[]
  sessionAndCommittee?: {
    legislativeMeetingSession?: {
      term: number
    }
    committee?: {
      name: string
    }[]
  }[]
}

export type SpeechModel = {
  id: string
  slug: string
  date: string
  title: string
  createdAt: number
  updatedAt: number
  summary?: string
  legislativeYuanMember?: {
    legislator?: {
      name: string
    }
  }
  legislativeMeeting?: {
    term: number
  }
  legislativeMeetingSession?: {
    term: number
  }
}

// Authenticate with Keystone and retrieve a session token
async function fetchKeystoneToken() {
  const gqlQuery = `
  mutation AuthenticateSystemUserWithPassword($email: String!, $password: String!) {
    authenticateSystemUserWithPassword(email: $email, password: $password) {
      ... on SystemUserAuthenticationWithPasswordSuccess {
        sessionToken
      }
      ... on SystemUserAuthenticationWithPasswordFailure {
        message
      }
    }
  }
  `

  const res = await axios.post(apiEndpoint, {
    query: gqlQuery,
    variables: {
      email: headlessAccount.email,
      password: headlessAccount.password,
    },
  })

  const authResult = res.data?.data?.authenticateSystemUserWithPassword
  if (authResult?.message) {
    throw new Error(authResult.message)
  }

  const sessionToken = authResult?.sessionToken
  if (!sessionToken) {
    throw new Error('Keystone sessionToken is invalid or missing.')
  }

  return sessionToken
}

// Async generator for iterating over speeches with recent updates
export async function* speechIterator(
  updatedAfter: string,
  take = 10
): AsyncGenerator<SpeechModel[], void, unknown> {
  const keystoneToken = await fetchKeystoneToken()
  let cursor: { slug: string } | null = null
  let skip = 0
  let hasMore = true

  while (hasMore) {
    // Fetch a page of recent speeches
    const res: AxiosResponse<{
      data: {
        speeches: SpeechModel[]
      }
    }> = await axios.post(
      apiEndpoint,
      {
        query: `
          query Speeches($orderBy: [SpeechOrderByInput!]!, $take: Int, $skip: Int!, $cursor: SpeechWhereUniqueInput, $where: SpeechWhereInput!) {
            speeches(orderBy: $orderBy, take: $take, skip: $skip, cursor: $cursor, where: $where) {
              id
              slug
              title
              summary
              createdAt
              updatedAt
              legislativeMeeting {
                term
              }
              legislativeMeetingSession {
                term
              }
              legislativeYuanMember {
                legislator {
                  name
                }
              }
            }
          }
        `,
        variables: {
          take,
          skip,
          cursor,
          orderBy: [{ slug: 'asc' }],
          where: {
            updatedAt: {
              gte: new Date(updatedAfter),
            },
          },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keystoneToken}`,
        },
      }
    )

    const speeches = res.data.data.speeches

    // End iteration if no more speeches
    if (speeches.length === 0) {
      hasMore = false
    }

    yield speeches

    // Determine whether to fetch the next page
    if (speeches.length < take) {
      hasMore = false
    } else {
      // Use the last speech slug as the cursor for the next fetch
      cursor = {
        slug: speeches?.[speeches.length - 1]?.slug,
      }
      skip = 1 // Skip cursor record
    }
  }
}

// Async generator for iterating over topic statistics from recently updated speeches
export async function* topicIterator(
  updatedAfter: string,
  take = 10
): AsyncGenerator<TopicModel[], void, unknown> {
  const keystoneToken = await fetchKeystoneToken()
  let cursor: string | null = null
  let skip = 0
  let hasMore = true

  while (hasMore) {
    // Fetch a page of recent speeches
    const res: AxiosResponse<{
      data: {
        recentSpeechTopicStats: {
          topics: TopicModel[]
          speeches: { id: string }[]
        }
      }
    }> = await axios.post(
      apiEndpoint,
      {
        query: `
          query RecentSpeechTopicStats($take: Int, $skip: Int, $updatedAfter: CalendarDay, $debug: Boolean, $cursor: ID) {
            recentSpeechTopicStats(take: $take, skip: $skip, updatedAfter: $updatedAfter, debug: $debug, cursor: $cursor) {
              topics {
                topicInfo {
                  id
                  title
                  slug
                  lastSpeechAt
                  meetingTerm
                  sessionTerm
                }
                distinctMemberCount
                members {
                  memberId
                  name
                  count
                }
              }
              speeches {
                id
              }
            }
          }
        `,
        variables: { updatedAfter, take, skip, cursor, debug: false },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keystoneToken}`,
        },
      }
    )

    const stats = res.data.data.recentSpeechTopicStats
    const speeches = stats.speeches

    // End iteration if no more speeches
    if (speeches.length === 0) {
      hasMore = false
    }

    yield stats.topics

    // Determine whether to fetch the next page
    if (speeches.length < take) {
      hasMore = false
    } else {
      // Use the last speech ID as the cursor for the next fetch
      cursor = speeches?.[speeches.length - 1]?.id
      skip = 1 // Skip cursor record
    }
  }
}

// Async generator for iterating over legislators with recent updates or speeches
export async function* legislatorIterator(
  _updatedAfter: string,
  take = 10
): AsyncGenerator<LegislatorModel[]> {
  const keystoneToken = await fetchKeystoneToken()
  let skip = 0
  let hasMore = true
  const updatedAfter = new Date(_updatedAfter)

  while (hasMore) {
    // Query legislators who have been updated or have speeches after the given date
    const res: AxiosResponse<{
      data: {
        legislativeYuanMembers: LegislatorModel[]
      }
    }> = await axios.post(
      apiEndpoint,
      {
        query: `
          query LegislativeYuanMembers($where: LegislativeYuanMemberWhereInput!, $take: Int, $skip: Int, $orderBy: [LegislativeYuanMemberOrderByInput!]!) {
            legislativeYuanMembers(where: $where, take: $take, skip: $skip, orderBy: $orderBy) {
              id
              legislator { 
                name 
              } 
              legislativeMeeting {
                term
              }
            }
          }
        `,
        variables: {
          where: {
            OR: [
              {
                speeches: {
                  some: {
                    updatedAt: {
                      gte: updatedAfter,
                    },
                  },
                },
              },
              {
                updatedAt: {
                  gte: updatedAfter,
                },
              },
            ],
            legislativeMeeting: {
              term: {
                gte: 0,
              },
            },
          },
          take,
          skip,
          orderBy: [{ updatedAt: 'asc' }],
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${keystoneToken}`,
        },
      }
    )

    const membersToUpdate = res.data.data.legislativeYuanMembers

    if (membersToUpdate.length === 0) {
      hasMore = false
    }

    // Collect unique legislator IDs and build detailed queries
    const ids: string[] = []
    const memberWithSpeechQueryTasks = membersToUpdate.reduce((tasks, m) => {
      const id = m.id
      if (ids.includes(id)) return tasks

      ids.push(id)

      tasks.push(async () => {
        // Collect legislator data in the specified meeting term
        const _res: AxiosResponse<{
          data: {
            legislativeYuanMember: LegislatorModel
          }
        }> = await axios.post(
          apiEndpoint,
          {
            query: `
              query LegislativeYuanMember($where: LegislativeYuanMemberWhereUniqueInput!, $speechWhere: SpeechWhereInput!) {
                legislativeYuanMember(where: $where) {
                  id
                  constituency
                  note
                  party {
                    name
                    imageLink
                    image {
                      imageFile {
                        url
                      }
                    }
                  }
                  legislator {
                    slug
                    name
                    imageLink
                  }
                  legislativeMeeting {
                    term
                  }
                  speeches(where: $speechWhere, take: 1, orderBy: [{ date: desc }]) {
                    date
                  }
                  sessionAndCommittee {
                    legislativeMeetingSession {
                      term
                    }
                    committee {
                      name
                    }
                  }
                }
              }
            `,
            variables: {
              where: { id: m.id },
              speechWhere: {
                legislativeMeeting: {
                  term: { equals: m.legislativeMeeting?.term },
                },
              },
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${keystoneToken}`,
            },
          }
        )

        return _res.data.data.legislativeYuanMember
      })

      return tasks
    }, [] as (() => Promise<LegislatorModel>)[])

    // Execute all detailed queries in controlled concurrent batches
    const queryResults = await runInBatches(memberWithSpeechQueryTasks, 10)
    const memberRecords: LegislatorModel[] = queryResults.flat()

    yield memberRecords

    // Check if more data remains to be fetched
    if (membersToUpdate.length < take) {
      hasMore = false
    } else {
      skip = skip + take
    }
  }
}

// Run an array of async tasks in batches to control concurrency
async function runInBatches<T>(
  tasks: (() => Promise<T>)[],
  batchSize: number
): Promise<T[]> {
  const results: T[] = []

  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map((task) => task()))
    results.push(...batchResults)
  }

  return results
}
