import keystoneFetch from '@/app/api/_graphql/keystone'
import type { BillMeta } from '@/types/council-bill'
import type { CouncilWorkData } from '@/types/council-work'
import { mergeCouncilWork } from '@/utils/council-work'

type FetchCouncilWorkParams = {
  councilorSlug: string
  topicSlug: string
  councilMeetingId: number
}

const fetchCouncilWork = async ({
  councilorSlug,
  topicSlug,
  councilMeetingId,
}: FetchCouncilWorkParams): Promise<CouncilWorkData> => {
  const query = `
    query CouncilWork($speechWhere: CouncilSpeechWhereInput!, $billWhere: CouncilBillWhereInput!, $speechOrderBy: [CouncilSpeechOrderByInput!]!, $billOrderBy: [CouncilBillOrderByInput!]!) {
      councilSpeeches(where: $speechWhere, orderBy: $speechOrderBy) {
        date
        slug
        summaryFallback
        title
      }
      councilBills(where: $billWhere, orderBy: $billOrderBy) {
        date
        slug
        summaryFallback
        title
      }
    }
  `
  const topic = { some: { slug: { equals: topicSlug } } }
  const councilMeeting = { id: { equals: councilMeetingId } }
  const councilor = { slug: { equals: councilorSlug } }
  const variables = {
    speechWhere: {
      topic,
      councilMeeting,
      councilMember: { some: { councilor } },
    },
    billWhere: {
      topic,
      councilMeeting,
      councilMember: { some: { councilor } },
    },
    speechOrderBy: [{ date: 'desc' }],
    billOrderBy: [{ date: 'desc' }],
  }
  const data = await keystoneFetch<{
    councilSpeeches: BillMeta[]
    councilBills: BillMeta[]
  }>(JSON.stringify({ query, variables }), false)

  const speeches = data?.data?.councilSpeeches || []
  const bills = data?.data?.councilBills || []
  return {
    work: mergeCouncilWork(speeches, bills),
    speechCount: speeches.length,
    billCount: bills.length,
  }
}

export default fetchCouncilWork
