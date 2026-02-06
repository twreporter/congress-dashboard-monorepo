import type { AxiosResponse } from 'axios'
import axios from 'axios'
import * as dotenv from 'dotenv'

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

// Topic data structure
export type TopicModel = {
  id: string
  slug: string
  title: string
  speeches: {
    id: number
    date: string
    legislativeMeeting: {
      term: number
    }
    legislativeYuanMember: {
      id: number
      legislator: {
        name: string
      } | null
    } | null
  }[]
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

// Council data structures
export type CouncilorModel = {
  id: string
  councilor: {
    name: string
    slug: string
    imageLink?: string
  } | null
  party?: {
    name: string
    imageLink?: string
    image?: {
      imageFile: {
        url: string
      }
    }
  }
  councilMeeting?: {
    term: number
  }
  city: string
  constituency?: number
  note: string
  bill: {
    date: string
  }[]
}

export type CouncilTopicModel = {
  id: string
  slug: string
  title: string
  city: string
  bill: {
    id: string
    date: string
    councilMeeting?: {
      term: number
    }
    councilMember: {
      id: number
      councilor: {
        name: string
      } | null
    }[]
  }[]
}

export type CouncilBillModel = {
  id: string
  slug: string
  title: string
  date: string
  summary?: string
  councilMeeting?: {
    city: string
  }
  councilMember: {
    councilor: {
      name: string
    } | null
  }[]
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
  meetingTerm: number,
  take = 10
): AsyncGenerator<TopicModel[], void, unknown> {
  const keystoneToken = await fetchKeystoneToken()
  let cursor: { slug: string } | null = null
  let skip = 0
  let hasMore = true

  while (hasMore) {
    let res: AxiosResponse<{
      errors: any
      data: {
        topics: TopicModel[]
      }
    }>

    try {
      // Page topics (ordered by slug) and include each topic’s speeches filtered by meetingTerm.
      // Cursor-based pagination applies to topics, not speeches.
      res = await axios.post(
        apiEndpoint,
        {
          query: `
          query Topics(
            $where: TopicWhereInput!
            $speechesWhere: SpeechWhereInput!
            $orderBy: [TopicOrderByInput!]!
            $cursor: TopicWhereUniqueInput
            $skip: Int!
            $take: Int
          ) {
            topics(
              where: $where
              orderBy: $orderBy
              cursor: $cursor
              skip: $skip
              take: $take
            ) {
              id
              title
              slug
              speeches(where: $speechesWhere) {
                date
                legislativeMeeting {
                  term
                }
                legislativeYuanMember {
                  id
                  legislator {
                    name
                    id
                  }
                }
              }
            }
          }
          `,
          variables: {
            where: {
              speeches: {
                some: {
                  legislativeMeeting: {
                    term: {
                      equals: meetingTerm,
                    },
                  },
                },
              },
            },
            speechesWhere: {
              legislativeMeeting: {
                term: {
                  equals: meetingTerm,
                },
              },
            },
            take,
            skip,
            cursor,
            orderBy: [{ slug: 'asc' }],
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
        'GQL query `Topics` responses errors object: ' +
          JSON.stringify(res.data.errors)
      )
    }

    const topics = res.data.data.topics

    // End iteration if no more speeches
    if (topics.length === 0) {
      hasMore = false
    }

    yield topics

    // Determine whether to fetch the next page
    if (topics.length < take) {
      hasMore = false
    } else {
      // Use the last speech ID as the cursor for the next fetch
      cursor = {
        slug: topics?.[topics.length - 1]?.slug,
      }
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

// Async generator for iterating over councilors in a specific city
export async function* councilorIterator(
  councilName: string,
  take = 10
): AsyncGenerator<CouncilorModel[]> {
  const keystoneToken = await fetchKeystoneToken()
  let cursor: { id: string } | null = null
  let skip = 0
  let hasMore = true

  while (hasMore) {
    let res: AxiosResponse<{
      errors: any
      data: {
        councilMembers: CouncilorModel[]
      }
    }>

    try {
      res = await axios.post(
        apiEndpoint,
        {
          query: `
          query CouncilMembers(
            $orderBy: [CouncilMemberOrderByInput!]!
            $take: Int
            $skip: Int!
            $cursor: CouncilMemberWhereUniqueInput
            $where: CouncilMemberWhereInput!
          ) {
            councilMembers(
              orderBy: $orderBy
              take: $take
              skip: $skip
              cursor: $cursor
              where: $where
            ) {
              id
              note
              city
              constituency
              councilMeeting {
                term
              }
              councilor {
                slug
                name
                imageLink
              }
              party {
                name
                imageLink
                image {
                  imageFile {
                    url
                  }
                }
              }
              bill(take: 1, orderBy: [{ date: desc }]) {
                date
              }
            }
          }
          `,
          variables: {
            where: {
              city: {
                equals: councilName,
              },
              isActive: {
                equals: true,
              },
            },
            take,
            skip,
            cursor,
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
        'GQL query `CouncilMembers` responses errors object: ' +
          JSON.stringify(res.data.errors)
      )
    }

    const members: CouncilorModel[] = res.data.data.councilMembers
    if (members.length === 0) {
      hasMore = false
    }

    yield members

    if (members.length < take) {
      hasMore = false
    } else {
      cursor = {
        id: members?.[members.length - 1]?.id,
      }
      skip = 1
    }
  }
}

// Async generator for iterating over council topics in a specific city
export async function* councilTopicIterator(
  councilName: string,
  take = 10
): AsyncGenerator<CouncilTopicModel[], void, unknown> {
  const keystoneToken = await fetchKeystoneToken()
  let cursor: { slug: string } | null = null
  let skip = 0
  let hasMore = true

  while (hasMore) {
    let res: AxiosResponse<{
      errors: any
      data: {
        councilTopics: CouncilTopicModel[]
      }
    }>

    try {
      res = await axios.post(
        apiEndpoint,
        {
          query: `
          query CouncilTopics(
            $where: CouncilTopicWhereInput!
            $billWhere: CouncilBillWhereInput!
            $orderBy: [CouncilTopicOrderByInput!]!
            $cursor: CouncilTopicWhereUniqueInput
            $skip: Int!
            $take: Int
          ) {
            councilTopics(
              where: $where
              orderBy: $orderBy
              cursor: $cursor
              skip: $skip
              take: $take
            ) {
              id
              title
              slug
              city
              bill(where: $billWhere) {
                id
                date
                councilMeeting {
                  term
                }
                councilMember {
                  id
                  councilor {
                    name
                  }
                }
              }
            }
          }
          `,
          variables: {
            where: {
              city: {
                equals: councilName,
              },
              bill: {
                some: {
                  councilMeeting: {
                    city: {
                      equals: councilName,
                    },
                  },
                },
              },
            },
            billWhere: {
              councilMeeting: {
                city: {
                  equals: councilName,
                },
              },
            },
            take,
            skip,
            cursor,
            orderBy: [{ slug: 'asc' }],
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
        'GQL query `CouncilTopics` responses errors object: ' +
          JSON.stringify(res.data.errors)
      )
    }

    const topics = res.data.data.councilTopics

    if (topics.length === 0) {
      hasMore = false
    }

    yield topics

    if (topics.length < take) {
      hasMore = false
    } else {
      cursor = {
        slug: topics?.[topics.length - 1]?.slug,
      }
      skip = 1
    }
  }
}

// Async generator for iterating over council bills in a specific city
export async function* councilBillIterator(
  councilName: string,
  take = 10
): AsyncGenerator<CouncilBillModel[], void, unknown> {
  const keystoneToken = await fetchKeystoneToken()
  let cursor: { slug: string } | null = null
  let skip = 0
  let hasMore = true

  while (hasMore) {
    let res: AxiosResponse<{
      errors: any
      data: {
        councilBills: CouncilBillModel[]
      }
    }>

    try {
      res = await axios.post(
        apiEndpoint,
        {
          query: `
          query CouncilBills(
            $orderBy: [CouncilBillOrderByInput!]!
            $take: Int
            $skip: Int!
            $cursor: CouncilBillWhereUniqueInput
            $where: CouncilBillWhereInput!
          ) {
            councilBills(
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
              councilMeeting {
                city
              }
              councilMember {
                councilor {
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
              councilMeeting: {
                city: {
                  equals: councilName,
                },
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
    } catch (axiosError) {
      throw errors.helpers.annotateAxiosError(axiosError)
    }

    if (res.data.errors) {
      throw new Error(
        'GQL query `CouncilBills` responses errors object: ' +
          JSON.stringify(res.data.errors)
      )
    }

    const bills = res.data.data.councilBills

    if (bills.length === 0) {
      hasMore = false
    }

    yield bills

    if (bills.length < take) {
      hasMore = false
    } else {
      cursor = {
        slug: bills?.[bills.length - 1]?.slug,
      }
      skip = 1
    }
  }
}
