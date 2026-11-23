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
    query CouncilWork($councilorSlug: String!, $topicSlug: String!, $councilMeetingId: Int!, $take: Int!, $skip: Int!) {
      councilWorkPage(councilorSlug: $councilorSlug, topicSlug: $topicSlug, councilMeetingId: $councilMeetingId, take: $take, skip: $skip) {
        speeches { date slug summaryFallback title }
        bills { date slug summaryFallback title }
      }
    }
  `
  const speeches: BillMeta[] = []
  const bills: BillMeta[] = []
  const take = 100
  // Keep the existing complete-list contract while bounding each CMS/DB read.
  for (let skip = 0; ; skip += take) {
    const variables = { councilorSlug, topicSlug, councilMeetingId, take, skip }
    const result = await keystoneFetch<{
      councilWorkPage: { speeches: BillMeta[]; bills: BillMeta[] }
    }>(JSON.stringify({ query, variables }), false)
    if (result.errors?.length) throw new Error(JSON.stringify(result.errors))
    const page = result.data?.councilWorkPage
    if (!page) throw new Error('Missing council work page')
    speeches.push(...page.speeches)
    bills.push(...page.bills)
    if (page.speeches.length < take && page.bills.length < take) break
  }
  return {
    work: mergeCouncilWork(speeches, bills),
    speechCount: speeches.length,
    billCount: bills.length,
  }
}

export default fetchCouncilWork
