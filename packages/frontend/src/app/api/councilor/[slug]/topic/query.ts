import { fetchLatestCouncilMeetingOfACity } from '@/fetchers/server/council-meeting'
import { fetchCouncilorTopics } from '@/fetchers/server/councilor'
import { isValidCouncil } from '@/utils/council'
// type
import type { CouncilTopicForFilter } from '@/types/council-topic'

type FetchTopicsOfACouncilorParams = {
  councilorSlug: string
  city: string
  councilMeetingId?: number
  excludeTopicSlug?: string
  top?: number
}

const fetchTopicsOfACouncilor = async ({
  councilorSlug,
  city,
  councilMeetingId,
  excludeTopicSlug,
  top,
}: FetchTopicsOfACouncilorParams): Promise<CouncilTopicForFilter[]> => {
  if (!isValidCouncil(city)) return []

  const meetingId =
    councilMeetingId ?? (await fetchLatestCouncilMeetingOfACity({ city }))?.id
  if (!meetingId) return []

  // Aggregate in the CMS instead of loading every related work and councilor.
  const topics = await fetchCouncilorTopics({
    slug: councilorSlug,
    districtSlug: city,
    councilMeetingId: meetingId,
  })
  const filteredTopics = topics.filter(({ slug }) => slug !== excludeTopicSlug)
  return top ? filteredTopics.slice(0, top) : filteredTopics
}

export default fetchTopicsOfACouncilor
