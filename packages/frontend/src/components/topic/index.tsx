'use client'
import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// twreporter
import {
  TabletAndAbove,
  TabletAndBelow,
  DesktopAndAbove,
} from '@twreporter/react-components/lib/rwd'
// components
import FilterButton from '@/components/button/filter-button'
import TopicList from '@/components/topic/topic-list'
import FilterModal from '@/components/filter-modal'
import TopicStatistics from '@/components/topic/topic-statistics'
import TopicRelatedArticles from '@/components/topic/topic-related-articles'
import TopicOthersWatching from '@/components/topic/topic-others-watching'
import TopicFeedback from '@/components/topic/topic-feedback'
// context
import { useScrollContext } from '@/contexts/scroll-context'
// styles
import {
  TopicWrapper,
  TopicContainer,
  LeadingContainer,
  TopicTitle,
  FilterBar,
  P1Gray700,
  Spacing,
  ContentBlock,
  DesktopAside,
  TopicListContainer,
  FunctionBarWrapper,
  FunctionBar,
  FunctionBarTitle,
} from '@/components/topic/styles'
//  fetcher
import { type TopicData } from '@/fetchers/topic'
// custom hooks
import { useTopicFilters } from '@/components/topic/hooks/use-topic-filters'
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
  const { setTabElement, isHeaderHidden } = useScrollContext()
  const leadingRef = useRef<HTMLDivElement>(null)
  const [isControllBarHidden, setIsControllBarHidden] = useState(true)

  // Custom hooks
  const {
    isFilterOpen,
    setIsFilterOpen,
    filterCount,
    filterValues,
    handleFilterValueChange,
    legislativeMeetingSessionState,
    filterOptions,
  } = useTopicFilters(currentMeetingTerm, currentMeetingSession)

  const { legislatorCount, legislatorsData, speechesByLegislator } =
    useTopicData(topic)

  useEffect(() => {
    if (leadingRef.current) {
      setTabElement(leadingRef.current)
    }
  }, [setTabElement, leadingRef])

  useEffect(() => {
    if (!leadingRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsControllBarHidden(entry.isIntersecting)
      },
      {
        threshold: 0.5,
      }
    )
    observer.observe(leadingRef.current)
    return () => {
      observer.disconnect()
    }
  }, [leadingRef])

  // Render a loading state if topic data is missing
  if (!topic) {
    return <div>Loading topic data...</div>
  }

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
      } else if (filterValues.meetingSession.length > 0) {
        // Use selected sessions
        sessionTermValue = filterValues.meetingSession.map(Number)
      } else {
        // Fallback to current session if nothing is selected
        console.warn('No meeting sessions selected, using current session')
      }

      const newUrl = `/topics/${topic.slug}?meetingTerm=${
        filterValues.meeting
      }&sessionTerm=${JSON.stringify(sessionTermValue)}`
      router.push(newUrl)
      setIsFilterOpen(false)
    } catch (error) {
      console.error('Error processing filter values:', error)
    }
  }

  return (
    <TopicWrapper>
      <FunctionBarWrapper
        $isHeaderHidden={isHeaderHidden}
        $isHidden={isControllBarHidden}
      >
        <FunctionBar>
          <FunctionBarTitle text={`#${topic?.title} 的相關發言摘要`} />
          <FilterBar onClick={openFilter}>
            <TabletAndAbove>
              <P1Gray700
                text={`第${currentMeetingTerm}屆｜${
                  filterValues.meetingSession.includes('all') ? '全部' : '部分'
                }會期`}
              />
            </TabletAndAbove>
            <FilterButton filterCount={filterCount} />
          </FilterBar>
        </FunctionBar>
      </FunctionBarWrapper>
      <TopicContainer>
        <LeadingContainer ref={leadingRef}>
          <TopicTitle text={`#${topic?.title} 的相關發言摘要`} />
          <FilterBar onClick={openFilter}>
            <P1Gray700
              text={`第${currentMeetingTerm}屆｜${
                filterValues.meetingSession.includes('all') ? '全部' : '部分'
              }會期`}
            />
            <FilterButton filterCount={filterCount} />
          </FilterBar>
        </LeadingContainer>
        <Spacing $height={32} />
        <ContentBlock>
          <DesktopAndAbove>
            <TopicListContainer>
              <TopicList
                legislatorsData={legislatorsData}
                speechesByLegislator={speechesByLegislator}
                currentMeetingTerm={currentMeetingTerm}
                currentMeetingSession={currentMeetingSession}
              />
            </TopicListContainer>
          </DesktopAndAbove>
          <DesktopAside>
            <TopicStatistics
              legislatorCount={legislatorCount}
              speechesCount={topic?.speechesCount}
            />
            <TopicRelatedArticles />
            <TopicOthersWatching
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
              currentMeetingTerm={currentMeetingTerm}
              currentMeetingSession={currentMeetingSession}
            />
            <Spacing $height={32} />
            <TopicFeedback />
          </TabletAndBelow>
        </ContentBlock>
      </TopicContainer>
      <FilterModal
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        onSubmit={handleSubmit}
        options={filterOptions}
        value={filterValues}
        onChange={handleFilterValueChange}
      />
    </TopicWrapper>
  )
}

export default Topic
