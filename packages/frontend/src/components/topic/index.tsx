'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
// twreporter
import { TabletAndBelow } from '@twreporter/react-components/lib/rwd'
// components
import TopicList from '@/components/topic/topic-list'
import FilterModal from '@/components/filter-modal'
import TopicStatistics from '@/components/topic/topic-statistics'
import TopicRelatedArticles from '@/components/topic/topic-related-articles'
import TopicOthersWatching from '@/components/topic/topic-others-watching'
import TopicFeedback from '@/components/topic/topic-feedback'
import ContentPageLayout from '@/components/layout/content-page-layout'
// styles
import {
  Spacing,
  DesktopList,
  DesktopAside,
  TopicListContainer,
} from '@/components/topic/styles'
//  fetcher
import { type TopicData } from '@/fetchers/server/topic'
// custom hooks
import { useLegislativeMeetingFilters } from '@/hooks/use-filters'
import { useTopicData } from '@/components/topic/hooks/use-topic-data'

type TopicPageProps = {
  topic: TopicData
  currentMeetingTerm: number
  currentMeetingSession: number[]
}

const Topic: React.FC<TopicPageProps> = ({
  topic,
  currentMeetingTerm,
  currentMeetingSession,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filterCount, setFilterCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(false)
  }, [searchParams])

  // Custom hooks
  const {
    isFilterOpen,
    setIsFilterOpen,
    filterValues,
    handleFilterValueChange,
    legislativeMeetingSessionState,
    filterOptions,
  } = useLegislativeMeetingFilters({
    currentMeetingTerm,
    currentMeetingSession,
  })

  const { legislatorCount, legislatorsData, speechesByLegislator } =
    useTopicData(topic)

  const openFilter = () => {
    setIsFilterOpen((prev) => !prev)
  }

  const handleSubmit = () => {
    if (!topic || !topic.slug) {
      console.error('Topic data is missing or invalid')
      return
    }

    let sessionTermValue = currentMeetingSession

    try {
      if (filterValues.meetingSession.includes('all')) {
        // Use all available sessions for the selected meeting term
        sessionTermValue =
          legislativeMeetingSessionState.legislativeMeetingSessions.map(
            ({ term }) => term
          )
        setFilterCount(0)
      } else if (filterValues.meetingSession.length > 0) {
        // Use selected sessions
        sessionTermValue = filterValues.meetingSession.map(Number)
        setFilterCount(filterValues.meetingSession.length)
      } else {
        // Fallback to current session if nothing is selected
        console.warn('No meeting sessions selected, using current session')
      }

      const newUrl = `/topics/${topic.slug}?meetingTerm=${
        filterValues.meeting
      }&sessionTerm=${JSON.stringify(sessionTermValue)}`
      router.push(newUrl)
      setIsLoading(true)
      setIsFilterOpen(false)
    } catch (error) {
      console.error('Error processing filter values:', error)
    }
  }

  const pageTitle = `#${topic?.title} 的相關發言摘要`

  return (
    <>
      <ContentPageLayout
        title={pageTitle}
        currentMeetingTerm={currentMeetingTerm}
        filterCount={filterCount}
        onFilterClick={openFilter}
      >
        <DesktopList>
          <TopicListContainer>
            <TopicList
              isLoading={isLoading}
              legislatorsData={legislatorsData}
              speechesByLegislator={speechesByLegislator}
              currentMeetingTerm={currentMeetingTerm}
              currentMeetingSession={currentMeetingSession}
            />
          </TopicListContainer>
        </DesktopList>
        <DesktopAside>
          <TopicStatistics
            legislatorCount={legislatorCount}
            speechesCount={topic?.speechesCount}
          />
          <TopicRelatedArticles />
          <TopicOthersWatching
            othersWatchingTags={topic?.relatedTopics}
            currentMeetingTerm={currentMeetingTerm}
            currentMeetingSession={currentMeetingSession}
          />
          <TopicFeedback />
        </DesktopAside>
        <TabletAndBelow>
          <TopicStatistics
            legislatorCount={legislatorCount}
            speechesCount={topic?.speechesCount}
          />
          <Spacing $height={32} />
          <TopicListContainer>
            <TopicList
              isLoading={isLoading}
              legislatorsData={legislatorsData}
              speechesByLegislator={speechesByLegislator}
              currentMeetingTerm={currentMeetingTerm}
              currentMeetingSession={currentMeetingSession}
            />
          </TopicListContainer>
          <Spacing $height={8} />
          <TopicRelatedArticles />
          <Spacing $height={8} />
          <TopicOthersWatching
            othersWatchingTags={topic?.relatedTopics}
            currentMeetingTerm={currentMeetingTerm}
            currentMeetingSession={currentMeetingSession}
          />
          <Spacing $height={32} />
          <TopicFeedback />
        </TabletAndBelow>
      </ContentPageLayout>

      <FilterModal
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        onSubmit={handleSubmit}
        options={filterOptions}
        value={filterValues}
        onChange={handleFilterValueChange}
      />
    </>
  )
}

export default Topic
