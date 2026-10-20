import { fetchLatestCouncilMeetingOfACity } from '@/fetchers/server/council-meeting'
import { fetchCouncilorTopics } from '@/fetchers/server/councilor'
import { isValidCouncil } from '@/utils/council'
// type
import type { CouncilTopicForFilter } from '@/types/council-topic'

type FetchTopicsOfACouncilorParams = {
  councilorSlug: string
  city: string
  excludeTopicSlug?: string
  top?: number
}

const fetchTopicsOfACouncilor = async ({
  councilorSlug,
  city,
  excludeTopicSlug,
  top,
}: FetchTopicsOfACouncilorParams): Promise<CouncilTopicForFilter[]> => {
  if (!isValidCouncil(city)) return []

  const meeting = await fetchLatestCouncilMeetingOfACity({ city })
  if (!meeting) return []

  // Aggregate in the CMS instead of loading every related work and councilor.
  const topics = await fetchCouncilorTopics({
    slug: councilorSlug,
    districtSlug: city,
    councilMeetingId: meeting.id,
  })
  const filteredTopics = topics.filter(({ slug }) => slug !== excludeTopicSlug)
  return top ? filteredTopics.slice(0, top) : filteredTopics
}

export default fetchTopicsOfACouncilor
