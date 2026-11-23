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
  type CouncilWorkResult {
    speeches: [CouncilWorkPreview!]!
    bills: [CouncilWorkPreview!]!
  }
  extend type CouncilMember {
    totalSpeechCount: Int!
  }
  extend type Query {
    councilWork(
      councilorSlug: String!
      topicSlug: String!
      councilMeetingId: Int!
    ): CouncilWorkResult!
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
    councilWork: async (
      _root: unknown,
      {
        councilorSlug,
        topicSlug,
        councilMeetingId,
      }: {
        councilorSlug: string
        topicSlug: string
        councilMeetingId: number
      },
      context: TypedKeystoneContext
    ) => {
      await requireReadAccess(context)
      // All batches (including fallback content) must see the same dataset.
      // Separate HTTP requests cannot share a database snapshot: imports can
      // otherwise move rows across offsets or change their membership links.
      return context.prisma.$transaction(
        async (tx) => {
          const where = {
            councilMeetingId,
            councilMember: { some: { councilor: { slug: councilorSlug } } },
            topic: { some: { slug: topicSlug } },
          }
          const preview = (item: {
            slug: string
            date: Date
            title: string
            summary: unknown
          }) => ({
            slug: item.slug,
            date: item.date.toISOString().slice(0, 10),
            title: item.title,
            summaryFallback: toPlainTextSummary('speech', item.summary),
          })
          const speeches: ReturnType<typeof preview>[] = []
          const bills: ReturnType<typeof preview>[] = []
          const take = 100
          for (let skip = 0; ; skip += take) {
            const args = {
              where,
              select: { slug: true, date: true, title: true, summary: true },
              orderBy: [{ date: 'desc' as const }, { id: 'desc' as const }],
              take,
              skip,
            }
            const speechBatch = await tx.councilSpeech.findMany(args)
            const billBatch = await tx.councilBill.findMany(args)
            const fallbackSlugs = billBatch
              .filter(
                (bill) =>
                  typeof bill.summary !== 'string' || !bill.summary.length
              )
              .map((bill) => bill.slug)
            // Fetch large bill content only when its summary cannot be used.
            // No speech content is fetched, and the content read has no sort.
            const fallbackBills = fallbackSlugs.length
              ? await tx.councilBill.findMany({
                  where: { slug: { in: fallbackSlugs } },
                  select: { slug: true, content: true },
                })
              : []
            const fallbackContent = new Map(
              fallbackBills.map((bill) => [bill.slug, bill.content])
            )
            speeches.push(...speechBatch.map(preview))
            bills.push(
              ...billBatch.map((bill) => ({
                ...preview(bill),
                summaryFallback:
                  typeof bill.summary === 'string' && bill.summary.length > 0
                    ? toPlainTextSummary('bill', bill.summary)
                    : toPlainTextSummary(
                        'bill',
                        fallbackContent.get(bill.slug),
                        100
                      ),
              }))
            )
            if (speechBatch.length < take && billBatch.length < take) break
          }
          return { speeches, bills }
        },
        {
          isolationLevel: 'RepeatableRead',
          // Bound snapshot lifetime; timeout rejects the entire collection.
          timeout: 30000,
        }
      )
    },
  },
}
