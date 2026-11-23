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
    query CouncilWork($councilorSlug: String!, $topicSlug: String!, $councilMeetingId: Int!) {
      councilWork(councilorSlug: $councilorSlug, topicSlug: $topicSlug, councilMeetingId: $councilMeetingId) {
        speeches { date slug summaryFallback title }
        bills { date slug summaryFallback title }
      }
    }
  `
  // The CMS collects bounded batches inside one consistent database snapshot.
  const variables = { councilorSlug, topicSlug, councilMeetingId }
  const result = await keystoneFetch<{
    councilWork: { speeches: BillMeta[]; bills: BillMeta[] }
  }>(JSON.stringify({ query, variables }), false)
  if (result.errors?.length) throw new Error(JSON.stringify(result.errors))
  if (!result.data?.councilWork) throw new Error('Missing council work result')
  const { speeches, bills } = result.data.councilWork
  return {
    work: mergeCouncilWork(speeches, bills),
    speechCount: speeches.length,
    billCount: bills.length,
  }
}

export default fetchCouncilWork
