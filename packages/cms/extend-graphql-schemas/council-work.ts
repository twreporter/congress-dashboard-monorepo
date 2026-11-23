import type { KeystoneContext } from '@keystone-6/core/types'
import { gql } from 'graphql-tag'
import { GraphQLError } from 'graphql'
import type { TypedKeystoneContext } from '../types/context'
import { allowAllRoles } from '../lists/utils/access-control-list'
import toPlainTextSummary from '../lists/utils/summary-parser'

export const councilWorkTypeDefs = gql`
  type CouncilWorkPreview {
    slug: String!
    date: String!
    title: String!
    summaryFallback: String
  }
  type CouncilWorkPage {
    speeches: [CouncilWorkPreview!]!
    bills: [CouncilWorkPreview!]!
  }
  extend type CouncilMember {
    totalSpeechCount: Int!
  }
  extend type Query {
    councilWorkPage(
      councilorSlug: String!
      topicSlug: String!
      councilMeetingId: Int!
      take: Int! = 100
      skip: Int! = 0
    ): CouncilWorkPage!
  }
`

// Direct Prisma queries bypass Keystone access checks. All participating lists
// currently share this query policy; keep this guard in sync with those lists.
async function requireReadAccess(context: KeystoneContext<any>) {
  if (
    !(await allowAllRoles()({
      context,
      session: context.session,
      listKey: 'CouncilSpeech',
      operation: 'query',
    }))
  ) {
    throw new GraphQLError('Access denied', {
      extensions: { code: 'FORBIDDEN' },
    })
  }
}

export const councilWorkResolver = {
  CouncilMember: {
    totalSpeechCount: async (
      item: { id: number | string },
      _args: unknown,
      context: TypedKeystoneContext
    ) => {
      await requireReadAccess(context)
      // A/B is unique and A is the leading index column. Counting links avoids
      // scanning speech rows and counts each speech once for this membership.
      const rows = await context.prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*) AS count FROM \`_CouncilMember_speech\`
        WHERE A = ${Number(item.id)}
      `
      return Number(rows[0].count)
    },
  },
  Query: {
    councilWorkPage: async (
      _root: unknown,
      {
        councilorSlug,
        topicSlug,
        councilMeetingId,
        take,
        skip,
      }: {
        councilorSlug: string
        topicSlug: string
        councilMeetingId: number
        take: number
        skip: number
      },
      context: TypedKeystoneContext
    ) => {
      await requireReadAccess(context)
      if (
        !Number.isInteger(take) ||
        take < 1 ||
        take > 100 ||
        !Number.isInteger(skip) ||
        skip < 0
      ) {
        throw new GraphQLError(
          'take must be 1–100 and skip must be nonnegative',
          {
            extensions: { code: 'BAD_USER_INPUT' },
          }
        )
      }
      const args = {
        where: {
          councilMeetingId,
          councilMember: { some: { councilor: { slug: councilorSlug } } },
          topic: { some: { slug: topicSlug } },
        },
        // Keystone's generic findMany fetches every scalar, including content.
        // Select only the metadata needed by the work list, before sorting.
        select: { slug: true, date: true, title: true, summary: true },
        orderBy: [{ date: 'desc' as const }, { id: 'desc' as const }],
        take,
        skip,
      }
      const speeches = await context.prisma.councilSpeech.findMany(args)
      const bills = await context.prisma.councilBill.findMany(args)
      const preview =
        (kind: 'speech' | 'bill') =>
        (item: {
          slug: string
          date: Date
          title: string
          summary: unknown
        }) => ({
          slug: item.slug,
          date: item.date.toISOString().slice(0, 10),
          title: item.title,
          summaryFallback: toPlainTextSummary(kind, item.summary),
        })
      return {
        speeches: speeches.map(preview('speech')),
        bills: bills.map(preview('bill')),
      }
    },
  },
}
