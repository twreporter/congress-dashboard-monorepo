'use client'
// type
import type { CouncilDistrict } from '@/types/council'
import type { CouncilorWithBillCount } from '@/types/councilor'
import type {
  CouncilTopicForFilter,
  TopNTopicForCouncilors,
} from '@/types/council-topic'
import type { CouncilorForIndex } from '@/components/council-dashboard/type'

// global var
const apiBase = process.env.NEXT_PUBLIC_API_URL as string

export type FetchTopCouncilorOfATopicParams = {
  topicSlug: string
  districtSlug: CouncilDistrict
  excludeCouncilorSlug: string
}
export const fetchTop5CouncilorOfATopic = async ({
  topicSlug,
  districtSlug,
  excludeCouncilorSlug,
}: FetchTopCouncilorOfATopicParams): Promise<CouncilorWithBillCount[]> => {
  const url = `${apiBase}/council-topic/${topicSlug}/councilor?city=${districtSlug}&exclude=${excludeCouncilorSlug}&top=5`
  const res = await fetch(url, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch top 5 councilor of topic ${topicSlug}`)
  }
  const data = await res.json()
  return data?.data || []
}

type FetchTopicsOfACouncilorParams = {
  councilorSlug: string
  districtSlug: CouncilDistrict
}
export const fetchTopicsOfACouncilor = async ({
  councilorSlug,
  districtSlug,
}: FetchTopicsOfACouncilorParams): Promise<CouncilTopicForFilter[]> => {
  const url = `${apiBase}/councilor/${councilorSlug}/topic?city=${districtSlug}`
  const res = await fetch(url, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(
      `Failed to fetch topics of councilor ${councilorSlug} in city ${districtSlug}`
    )
  }
  const data = await res.json()
  return data?.data || []
}

/* fetchCouncilors
 *   fetch councilor data of given meeting term & party & constituency
 */
type FetchCouncilorsParams = {
  councilMeetingId: number
  partyIds?: number[]
  constituencies?: number[]
}
export const fetchCouncilors = async ({
  councilMeetingId,
  partyIds,
  constituencies,
}: FetchCouncilorsParams): Promise<CouncilorForIndex[]> => {
  let url = `${apiBase}/councilor?mid=${encodeURIComponent(councilMeetingId)}`
  if (partyIds && partyIds.length > 0) {
    url = url.concat(`&pids=${partyIds}`)
  }
  if (constituencies && constituencies.length > 0) {
    url = url.concat(`&cvs=${constituencies}`)
  }

  const res = await fetch(url, {
    method: 'GET',
  })
  if (!res.ok) {
    throw new Error(
      `Failed to fetch councilors. meetingId: ${councilMeetingId}, partyIds: ${partyIds}, constituencies: ${constituencies}`
    )
  }
  const data = await res.json()
  return data?.data || []
}

/* fetchTopNTopicsOfCouncilMembers
 *   fetch top N topics of given council member ids in given meeting
 */
type FetchTopNTopicsOfCouncilMembersParams = {
  councilMemberIds?: number[]
  councilMeetingId: number
  take?: number
}
export const fetchTopNTopicsOfCouncilMembers = async ({
  councilMemberIds,
  councilMeetingId,
  take = 5,
}: FetchTopNTopicsOfCouncilMembersParams): Promise<
  TopNTopicForCouncilors[]
> => {
  if (!councilMemberIds || councilMemberIds.length === 0) {
    return []
  }

  let url = `${apiBase}/index/councilor/${councilMemberIds}/topic?mid=${encodeURIComponent(
    councilMeetingId
  )}`
  if (take) {
    url = url.concat(`&top=${encodeURIComponent(take)}`)
  }

  const res = await fetch(url, {
    method: 'GET',
  })
  if (!res.ok) {
    throw new Error(
      `Failed to fetch top ${take} topics of council member id: ${councilMemberIds}. meetingId: ${councilMeetingId}`
    )
  }
  const data = await res.json()
  return data?.data || []
}
