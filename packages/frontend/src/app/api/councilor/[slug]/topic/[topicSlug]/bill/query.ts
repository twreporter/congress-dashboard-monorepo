import keystoneFetch from '@/app/api/_graphql/keystone'
// type
import type { BillMeta } from '@/types/council-bill'

type BillFromRes = BillMeta

type FetchBillsOfACouncilorInATopicParams = {
  councilorSlug: string
  topicSlug: string
  councilMeetingId: number
}

const fetchBillsOfACouncilorInATopic = async ({
  councilorSlug,
  topicSlug,
  councilMeetingId,
}: FetchBillsOfACouncilorInATopicParams) => {
  const query = `
    query CouncilBills($where: CouncilBillWhereInput!, $orderBy: [CouncilBillOrderByInput!]!) {
      councilBills(where: $where, orderBy: $orderBy) {
        date
        slug
        summary
        title
      }
    }
  `
  const variables = {
    where: {
      topic: {
        some: {
          slug: {
            equals: topicSlug,
          },
        },
      },
      councilMeeting: {
        id: {
          equals: councilMeetingId,
        },
      },
      councilMember: {
        some: {
          councilor: {
            slug: {
              equals: councilorSlug,
            },
          },
        },
      },
    },
    orderBy: [
      {
        date: 'desc',
      },
    ],
  }
  const data = await keystoneFetch<{
    councilBills: BillFromRes[]
  }>(JSON.stringify({ query, variables }), false)

  return data?.data?.councilBills || []
}

export default fetchBillsOfACouncilorInATopic
