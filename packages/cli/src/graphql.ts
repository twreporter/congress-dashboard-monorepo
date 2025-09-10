import type { AxiosResponse } from 'axios'
import axios from 'axios'
import * as dotenv from 'dotenv'
import { dryrunState } from './state/dryrun'

// @ts-ignore @twreporter/errors lacks of type definition
import errors from '@twreporter/errors'

dotenv.config()

// Ensure the GraphQL endpoint and headless account are set in environment variables
if (
  !process.env.GRAPHQL_ENDPOINT ||
  !process.env.HEADLESS_ACCOUNT_EMAIL ||
  !process.env.HEADLESS_ACCOUNT_PASSWORD
) {
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
  type?: string
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

// Async generator for iterating over speeches in the specific meeting and session term
export async function* speechIterator(
  meetingTerm: number,
  take = 10,
  sessionTerm?: number
): AsyncGenerator<SpeechModel[], void, unknown> {
  const keystoneToken = await fetchKeystoneToken()
  let cursor: { slug: string } | null = null
  let skip = 0
  let hasMore = true

  while (hasMore) {
    let res: AxiosResponse<{
      errors: any
      data: {
        speeches: SpeechModel[]
      }
    }>
    try {
      // Page speeches by meeting term (and optional session term),
      // ordered by slug asc, with cursor pagination.
      // Returns core fields + meeting/session term + legislator name.
      res = await axios.post(
        apiEndpoint,
        {
          query: `
          query Speeches(
            $orderBy: [SpeechOrderByInput!]!
            $take: Int
            $skip: Int!
            $cursor: SpeechWhereUniqueInput
            $where: SpeechWhereInput!
          ) {
            speeches(
              orderBy: $orderBy
              take: $take
              skip: $skip
              cursor: $cursor
              where: $where
            ) {
              id
              slug
              title
              summary
              date
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
              legislativeMeeting: {
                term: {
                  equals: meetingTerm,
                },
              },
              ...(sessionTerm
                ? {
                    legislativeMeetingSession: {
                      term: {
                        equals: sessionTerm,
                      },
                    },
                  }
                : {}),
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
    } catch (axiosError) {
      throw errors.helpers.annotateAxiosError(axiosError)
    }

    if (res.data.errors) {
      throw new Error(
        'GQL query `Speeches` responses errors object: ' +
          JSON.stringify(res.data.errors)
      )
    }

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
        variables: {
          updatedAfter,
          take,
          skip,
          cursor,
          debug: dryrunState.isEnabled(),
        },
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

// Async generator for iterating over legislators in the specific meeting term
export async function* legislatorIterator(
  meetingTerm: number,
  take = 10
): AsyncGenerator<LegislatorModel[]> {
  const keystoneToken = await fetchKeystoneToken()
  let skip = 0
  let hasMore = true

  while (hasMore) {
    let res: AxiosResponse<{
      errors: any
      data: {
        legislativeYuanMembers: LegislatorModel[]
      }
    }>

    try {
      // Query a paginated list of Legislative Yuan members (offset-based via take/skip),
      // filtered by a specific legislative meeting term (`meetingTerm`).
      // The result includes:
      //   - Member metadata (id, type, constituency, note)
      //   - Legislator info (slug, name, imageLink)
      //   - Party info (name, images)
      //   - Legislative meeting term
      //   - The latest speech (speeches ordered by date desc, limited to 1)
      //   - Committees the legislator joins
      res = await axios.post(
        apiEndpoint,
        {
          query: `
          query LegislativeYuanMembers(
            $orderBy: [LegislativeYuanMemberOrderByInput!]!
            $take: Int
            $skip: Int!
            $where: LegislativeYuanMemberWhereInput!
          ) {
            legislativeYuanMembers(
              orderBy: $orderBy
              take: $take
              skip: $skip
              where: $where
            ) {
              id
              type
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
              speeches(take: 1, orderBy: [{ date: desc }]) {
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
            where: {
              legislativeMeeting: {
                term: {
                  equals: meetingTerm,
                },
              },
            },
            take,
            skip,
            orderBy: [{ id: 'asc' }],
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${keystoneToken}`,
          },
        }
      )
    } catch (axiosError) {
      throw errors.helpers.annotateAxiosError(axiosError)
    }

    if (res.data.errors) {
      throw new Error(
        'GQL query `LegislativeYuanMembers` responses errors object: ' +
          JSON.stringify(res.data.errors)
      )
    }

    const members: LegislatorModel[] = res.data.data.legislativeYuanMembers
    if (members.length === 0) {
      hasMore = false
    }

    yield members

    // Check if more data remains to be fetched
    if (members.length < take) {
      hasMore = false
    } else {
      skip = skip + take
    }
  }
}
