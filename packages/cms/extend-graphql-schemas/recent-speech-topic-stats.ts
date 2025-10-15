// @ts-ignore @twreporter/errors lacks of type definition
import errors from '@twreporter/errors'
import type { TypedKeystoneContext } from '../types/context'
import { gql } from 'graphql-tag'
import { logger } from '../utils/logger'

export const recentSpeechTopicStatsTypeDefs = gql`
  type MemberSpeechCount {
    memberId: ID!
    name: String!
    count: Int!
  }

  type TopicInfo {
    id: ID!
    title: String!
    slug: String!
    lastSpeechAt: String!
    meetingTerm: Int
    sessionTerm: Int
  }

  type MemberSpeechCountByTopic {
    topicInfo: TopicInfo!
    distinctMemberCount: Int!
    members: [MemberSpeechCount!]!
  }

  type SpeechSummary {
    id: ID!
    title: String!
    meetingTerm: Int
    sessionTerm: Int
    date: String!
    createdAt: String!
    updatedAt: String!
  }

  type RecentSpeechTopicStatsResult {
    topics: [MemberSpeechCountByTopic!]!
    speeches: [SpeechSummary!]!
  }

  extend type Query {
    """
    Goal:
    Retrieve topics with speeches updated after the specified \`updatedAfter\` date,
    and count the number of member speeches per topic.

    Returns:
    - member speech counts grouped by topic
    - a flat list of speeches whose \`updatedAt\` is after the \`updatedAfter\` date

    Speeches are derived from topics.
    """
    recentSpeechTopicStats(
      take: Int = 50
      skip: Int = 0
      cursor: ID
      updatedAfter: CalendarDay
      debug: Boolean = false
    ): RecentSpeechTopicStatsResult!
  }
`

type SpeechRecord = {
  id: number
  title: string
  date: Date
  topics: {
    id: number
    slug: string
  }[]
  legislativeMeeting: {
    term: number
  } | null
  legislativeMeetingSession: {
    term: number
  } | null
  createdAt: Date | null
  updatedAt: Date | null
}

type TopicRecord = {
  id: number
  slug: string
  title: string
  speeches: {
    id: number
    title: string
    date: Date
    legislativeMeeting: {
      term: number
    } | null
    legislativeMeetingSession: {
      term: number
    } | null
    legislativeYuanMember: {
      id: number
      legislator: {
        name: string
      } | null
    } | null
  }[]
}

type MemberSpeechCount = {
  memberId: string
  name: string
  count: number
}

type TopicInfo = {
  id: string
  slug: string
  title: string
  lastSpeechAt: string // ISO 8601 formatted date string
  meetingTerm?: number
  sessionTerm?: number
}

type MemberSpeechCountByTopic = {
  topicInfo: TopicInfo
  distinctMemberCount: number
  members: MemberSpeechCount[]
}

type SpeechSummary = {
  id: string
  title: string
  date: string // ISO 8601 formatted date string
  meetingTerm?: number
  sessionTerm?: number
}

type RecentSpeechTopicStatsResult = {
  topics: MemberSpeechCountByTopic[]
  speeches: SpeechSummary[]
}

export const recentSpeechTopicStatsResolvers = {
  Query: {
    recentSpeechTopicStats: async (
      _parent: unknown,
      {
        take = 50,
        skip = 0,
        cursor,
        updatedAfter,
        debug = false,
      }: {
        take?: number
        skip?: number
        cursor?: string
        updatedAfter: string
        debug?: boolean
      },
      context: TypedKeystoneContext
    ): Promise<RecentSpeechTopicStatsResult> => {
      try {
        const startTs = Date.now()
        logger.info('recentSpeechTopicStats executing', {
          jsonPayload: {
            args: { take, skip, cursor, updatedAfter },
          },
        })

        const speechRecords: SpeechRecord[] =
          await context.prisma.speech.findMany({
            take,
            skip,
            cursor: cursor ? { id: Number(cursor) } : undefined,
            orderBy: [
              {
                id: 'asc',
              },
            ],
            where: {
              // Fetch speeches updated after the specified date with valid meeting and session data
              updatedAt: {
                gte: new Date(updatedAfter),
              },
              legislativeMeeting: {
                isNot: null,
              },
              legislativeMeetingSession: {
                isNot: null,
              },
              legislativeYuanMember: {
                isNot: null,
              },
            },
            select: {
              id: true,
              title: true,
              date: true,
              createdAt: true,
              updatedAt: true,
              topics: {
                select: {
                  id: true,
                  slug: true,
                },
              },
              legislativeMeeting: {
                select: {
                  term: true,
                },
              },
              legislativeMeetingSession: {
                select: {
                  term: true,
                },
              },
            },
          })

        // Return empty result if no matching speech is found
        if (speechRecords.length === 0) {
          return {
            topics: [],
            speeches: [],
          }
        }

        // Group topic slugs by a composite key of meetingTerm and sessionTerm
        // This ensures that the same topic appearing in different legislative sessions is counted separately
        const groupedTopics: Record<string, string[]> = {}
        for (const r of speechRecords) {
          for (const t of r.topics) {
            const key = `${r.legislativeMeeting?.term}_${r.legislativeMeetingSession?.term}`
            if (!groupedTopics[key]) {
              groupedTopics[key] = []
            }
            if (groupedTopics[key].indexOf(t.slug) === -1) {
              groupedTopics[key].push(t.slug)
            }
          }
        }

        const topicQueryTasks = Object.entries(groupedTopics).map(
          ([key, topicSlugs]) => {
            return async () => {
              const [meetingTermStr, sessionTermStr] = key.split('_')
              const meetingTerm = parseInt(meetingTermStr, 10)
              const sessionTerm = parseInt(sessionTermStr, 10)

              return context.prisma.topic.findMany({
                // Retrieve topics by slug list only.
                // Then, filter their associated speeches by matching meetingTerm and sessionTerm (and ensuring the speaker is a member).
                where: {
                  slug: {
                    in: topicSlugs,
                  },
                },
                select: {
                  id: true,
                  slug: true,
                  title: true,
                  speeches: {
                    // Only include speeches made by members within the specified meeting/session term
                    where: {
                      legislativeMeeting: {
                        term: { equals: meetingTerm },
                      },
                      legislativeMeetingSession: {
                        term: { equals: sessionTerm },
                      },
                      legislativeYuanMember: {
                        isNot: null,
                      },
                    },
                    orderBy: { date: 'asc' },
                    select: {
                      id: true,
                      title: true,
                      date: true,
                      legislativeMeeting: { select: { term: true } },
                      legislativeMeetingSession: { select: { term: true } },
                      legislativeYuanMember: {
                        select: {
                          id: true,
                          legislator: { select: { name: true } },
                        },
                      },
                    },
                  },
                },
              })
            }
          }
        )

        // Execute queries in parallel using `runInBatches` to limit concurrency
        // and prevent overloading the system with too many simultaneous operations.
        const topicQueryResults = await runInBatches(topicQueryTasks, 10)
        const topicRecords: TopicRecord[] = topicQueryResults.flat()

        if (debug) {
          logger.debug('Prisma returned records.', {
            jsonPayload: { topicRecords },
          })
        }

        // Use a map to group topics uniquely by slug + meeting/session term
        const topicMap = new Map<
          string,
          {
            topicInfo: TopicInfo
            memberMap: Map<string, MemberSpeechCount>
          }
        >()

        for (const topicRecord of topicRecords) {
          const speeches = topicRecord.speeches
          for (const speech of speeches) {
            // Composite key to separate topics by session/term
            const topicMapKey = `${topicRecord.slug}_${speech.legislativeMeeting?.term}_${speech.legislativeMeetingSession?.term}`

            // Initialize topic info in map if not yet present
            if (!topicMap.has(topicMapKey)) {
              topicMap.set(topicMapKey, {
                topicInfo: {
                  id: topicRecord.id.toString(),
                  slug: topicRecord.slug,
                  title: topicRecord.title,
                  lastSpeechAt: speech.date.toISOString(),
                  meetingTerm: speech.legislativeMeeting?.term,
                  sessionTerm: speech.legislativeMeetingSession?.term,
                },
                memberMap: new Map(),
              })
            } else {
              // Update latest speech date for this topic instance
              const topicInfo = topicMap.get(topicMapKey)?.topicInfo
              if (
                topicInfo &&
                new Date(topicInfo.lastSpeechAt) < new Date(speech.date)
              ) {
                topicInfo.lastSpeechAt = speech.date.toISOString()
              }
            }

            const member = speech.legislativeYuanMember
            if (!member) {
              // Should not happen due to the Prisma where clause, but keep safe guard for types
              continue
            }
            const memberMap = topicMap.get(topicMapKey)?.memberMap
            const memberId = member.id.toString()
            const existing = memberMap?.get(memberId)

            if (existing) {
              // If already counted, increment speech count
              existing.count += 1
            } else {
              // Otherwise, add a new member speech record
              memberMap?.set(memberId, {
                memberId,
                name: member.legislator?.name ?? '',
                count: 1,
              })
            }
          }
        }

        const topics = Array.from(topicMap.entries()).map(
          ([, { topicInfo, memberMap }]) => ({
            topicInfo,
            // Number of distinct members who spoke on this topic
            distinctMemberCount: memberMap.size,
            members: Array.from(memberMap.values()).sort(
              (a, b) => b.count - a.count
            ),
          })
        )

        const speeches = speechRecords.map((s) => {
          return {
            id: s.id.toString(),
            date: s.date.toISOString(),
            title: s.title,
            meetingTerm: s.legislativeMeeting?.term,
            sessionTerm: s.legislativeMeetingSession?.term,
            createdAt: s.createdAt?.toISOString(),
            updatedAt: s.updatedAt?.toISOString(),
          }
        })

        if (debug) {
          logger.debug('Query returned value', {
            jsonPayload: { topics, speeches },
          })
        }

        logger.info('recentSpeechTopicStats executed', {
          jsonPayload: {
            args: { take, skip, cursor, updatedAfter },
            durationMs: Date.now() - startTs,
          },
        })

        return { topics, speeches }
      } catch (_err) {
        const err = errors.helpers.wrap(
          _err,
          'GraphQL Resolver Error',
          'Error to execute recentSpeechTopicStats query',
          {
            args: {
              take,
              skip,
              cursor,
              updatedAfter,
            },
          }
        )
        // Trigger Error Reporting
        logger.error('recentSpeechTopicStats failed', {
          error: errors.helpers.printAll(err, {
            withStack: true,
            withPayload: true,
          }),
        })
        throw err
      }
    },
  },
}

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
