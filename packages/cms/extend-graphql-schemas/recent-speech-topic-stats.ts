// @ts-ignore @twreporter/errors lacks of type definition
import errors from '@twreporter/errors'
import type { TypedKeystoneContext } from '../types/context'
import { gql } from 'graphql-tag'

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
  }

  type RecentSpeechTopicStatsResult {
    topics: [MemberSpeechCountByTopic!]!
    speeches: [SpeechSummary!]!
  }

  extend type Query {
    """
    Goal:
    Retrieve topics with speeches being on or after the specified \`after\` date,
    and count the number of member speeches per topic.

    Returns:
    - member speech counts grouped by topic
    - a flat list of speeches whose \`date\` is on or after the \`after\` date

    Speeches are derived from topics.
    """
    recentSpeechTopicStats(
      take: Int = 50
      skip: Int = 0
      cursor: ID
      after: CalendarDay
      debug: Boolean = false
    ): RecentSpeechTopicStatsResult!
  }
`

type SpeechRecord = {
  id: string
  legislativeMeeting: {
    term: number
  }
  legislativeMeetingSession: {
    term: number
  }
}

type TopicRecord = {
  id: string
  slug: string
  title: string
  speeches: {
    id: string
    title: string
    date: Date
    legislativeMeeting: {
      term: number
    }
    legislativeMeetingSession: {
      term: number
    }
    legislativeYuanMember: {
      id: string
      legislator: {
        name: string
      }
    }
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
        after,
        debug = false,
      }: {
        take?: number
        skip?: number
        cursor?: string
        after: string
        debug?: boolean
      },
      context: TypedKeystoneContext
    ): Promise<RecentSpeechTopicStatsResult> => {
      try {
        console.time(
          JSON.stringify({
            severity: 'INFO',
            message: 'recentSpeechTopicStats executing',
            jsonPayload: {
              args: {
                take,
                skip,
                cursor,
                after,
              },
            },
          })
        )

        // Fetch the earliest speech on or after the `after` date
        const speechRecord: SpeechRecord =
          await context.prisma.speech.findFirst({
            orderBy: { date: 'asc' },
            where: {
              // Filter speeches on or after the specified `after` date
              date: {
                gte: new Date(after),
              },
              // Ensure the speech has valid meeting and session terms (>= 1)
              legislativeMeeting: {
                term: {
                  gte: 1,
                },
              },
              legislativeMeetingSession: {
                term: {
                  gte: 1,
                },
              },
              legislativeYuanMember: {
                isNot: null,
              },
            },
            select: {
              id: true,
              legislativeMeeting: {
                select: { term: true },
              },
              legislativeMeetingSession: {
                select: { term: true },
              },
            },
          })

        // Return empty result if no matching speech is found
        if (!speechRecord) {
          return {
            topics: [],
            speeches: [],
          }
        }

        const meetingTerm = speechRecord.legislativeMeeting.term
        const sessionTerm = speechRecord.legislativeMeetingSession.term

        const topicRecords: TopicRecord[] = await context.prisma.topic.findMany(
          {
            take,
            skip,
            cursor: cursor ? { id: Number(cursor) } : undefined,
            where: {
              // Filter topics that have at least one speech after the specified `after` date
              speeches: {
                some: {
                  date: {
                    gte: new Date(after),
                  },
                },
              },
            },
            select: {
              id: true,
              slug: true,
              title: true,
              speeches: {
                where: {
                  /**
                   * Filter speeches using the following logic:
                   *  - Either the `legislativeMeeting.term` is greater than the `meetingTerm`.
                   *  - OR the `legislativeMeeting.term` is equal to `meetingTerm`,
                   *    AND the `legislativeMeetingSession.term` is greater than or equal to `sessionTerm`.
                   * This ensures that we won't fetch all the speeches at once.
                   */
                  OR: [
                    {
                      legislativeMeeting: {
                        term: {
                          gt: meetingTerm,
                        },
                      },
                    },
                    {
                      legislativeMeeting: {
                        term: {
                          equals: meetingTerm,
                        },
                      },
                      legislativeMeetingSession: {
                        term: {
                          gte: sessionTerm,
                        },
                      },
                    },
                  ],
                },
                orderBy: { date: 'asc' },
                select: {
                  id: true,
                  title: true,
                  date: true,
                  legislativeMeeting: {
                    select: { term: true },
                  },
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
          }
        )

        if (debug) {
          console.log(
            JSON.stringify({
              severity: 'DEBUG',
              message: 'Prisma returned records.',
              jsonPayload: {
                speechRecord,
                topicRecords,
              },
            })
          )
        }

        // Use a map to group topics uniquely by slug + meeting/session term
        const topicMap = new Map<
          string,
          {
            topicInfo: TopicInfo
            memberMap: Map<string, MemberSpeechCount>
          }
        >()

        // Use a map to collect deduplicated speeches
        const allSpeechMap = new Map<string, SpeechSummary>()

        for (const topicRecord of topicRecords) {
          const speeches = topicRecord.speeches
          for (const speech of speeches) {
            // Composite key to separate topics by session/term
            const topicMapKey = `${topicRecord.slug}_${speech.legislativeMeeting?.term}_${speech.legislativeMeetingSession?.term}`

            // Initialize topic info in map if not yet present
            if (!topicMap.has(topicMapKey)) {
              topicMap.set(topicMapKey, {
                topicInfo: {
                  id: topicRecord.id,
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
            const memberMap = topicMap.get(topicMapKey)?.memberMap
            const existing = memberMap?.get(member.id)

            if (existing) {
              // If already counted, increment speech count
              existing.count += 1
            } else {
              // Otherwise, add a new member speech record
              memberMap?.set(member.id, {
                memberId: member.id,
                name: member.legislator?.name ?? '',
                count: 1,
              })
            }

            // Collect deduplicated speeches
            allSpeechMap.set(speech.id, {
              id: speech.id,
              title: speech.title,
              meetingTerm: speech.legislativeMeeting?.term,
              sessionTerm: speech.legislativeMeetingSession?.term,
              date: speech.date.toISOString(),
            })
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

        const allSpeeches = Array.from(allSpeechMap.values())

        if (debug) {
          console.log(
            JSON.stringify({
              severity: 'DEBUG',
              message: 'Query returned value: ',
              jsonPayload: {
                topics,
                speeches: allSpeeches,
              },
            })
          )
        }

        console.timeEnd(
          JSON.stringify({
            severity: 'INFO',
            message: 'recentSpeechTopicStats executing',
            jsonPayload: {
              args: {
                take,
                skip,
                cursor,
                after,
              },
            },
          })
        )

        return { topics, speeches: allSpeeches }
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
              after,
            },
          }
        )
        // Trigger Error Reporting
        console.log(
          JSON.stringify({
            severity: 'ERROR',
            message: errors.helpers.printAll(err, {
              withStack: true,
              withPayload: true,
            }),
          })
        )
        throw err
      }
    },
  },
}
