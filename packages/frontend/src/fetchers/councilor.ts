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
  const params = new URLSearchParams({
    city: districtSlug,
    exclude: excludeCouncilorSlug,
    top: '5',
  })
  const url = `${apiBase}/council-topic/${topicSlug}/councilor?${params.toString()}`
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
  const params = new URLSearchParams({ city: districtSlug })
  const url = `${apiBase}/councilor/${councilorSlug}/topic?${params.toString()}`
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
  types?: string[]
}
export const fetchCouncilors = async ({
  councilMeetingId,
  partyIds,
  constituencies,
  types,
}: FetchCouncilorsParams): Promise<CouncilorForIndex[]> => {
  const params = new URLSearchParams({ mid: String(councilMeetingId) })
  if (partyIds && partyIds.length > 0) {
    params.set('pids', partyIds.join(','))
  }
  if (constituencies && constituencies.length > 0) {
    params.set('cvs', constituencies.join(','))
  }
  if (types && types.length > 0) {
    params.set('types', types.join(','))
  }
  const url = `${apiBase}/councilor?${params.toString()}`

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

  const params = new URLSearchParams({
    mid: String(councilMeetingId),
    top: String(take),
  })
  const url = `${apiBase}/index/councilor/${councilMemberIds}/topic?${params.toString()}`

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
