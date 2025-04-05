'use client'
import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// @twreporter
import {
  DesktopAndAbove,
  TabletAndBelow,
  TabletAndAbove,
} from '@twreporter/react-components/lib/rwd'
// components
import FilterButton from '@/components/button/filter-button'
import LegislatorInfo from '@/components/legislator/legislator-info'
import LegislatorStatistics from '@/components/legislator/legislator-statistics'
import LegislatorList from '@/components/legislator/legislator-list'
import Feedback from '@/components/topic/topic-feedback'
import FilterModal from '@/components/filter-modal'
// styles
import {
  LegislatorWrapper,
  LegislatorContainer,
  LeadingContainer,
  FilterBar,
  LegislatorTitle,
  P1Gray700,
  ContentBlock,
  DesktopAsideLeft,
  DesktopAsideRight,
  ListContainer,
  FunctionBarWrapper,
  FunctionBar,
  FunctionBarTitle,
} from '@/components/legislator/styles'
// fetcher
import {
  type LegislatorFromRes,
  type TopicData,
} from '@/fetchers/server/legislator'
// hooks
import { useLegislatorData } from '@/components/legislator/hooks/use-legislator-data'
// context
import { useScrollContext } from '@/contexts/scroll-context'
// custom hooks
import { useLegislatorFilters } from '@/components/legislator/hooks/use-legislator-filters'

type LegislatorProps = {
  legislatorData: LegislatorFromRes
  topicsData: TopicData[]
  currentMeetingTerm: number
  currentMeetingSession: number[]
}
const Legislator: React.FC<LegislatorProps> = ({
  legislatorData,
  topicsData,
  currentMeetingTerm,
  currentMeetingSession,
}) => {
  const router = useRouter()
  const { setTabElement, isHeaderHidden } = useScrollContext()
  const leadingRef = useRef<HTMLDivElement>(null)
  const [isControllBarHidden, setIsControllBarHidden] = useState(true)

  const {
    isFilterOpen,
    setIsFilterOpen,
    filterCount,
    filterValues,
    handleFilterValueChange,
    legislativeMeetingSessionState,
    filterOptions,
  } = useLegislatorFilters(currentMeetingTerm, currentMeetingSession)

  const { legislator, topics, speechesByTopic } = useLegislatorData(
    legislatorData,
    topicsData
  )

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

  const openFilter = () => {
    setIsFilterOpen((prev) => !prev)
  }

  const handleSubmit = () => {
    if (!legislator || !legislator.slug) {
      console.error('Legislator data is missing or invalid')
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

      const newUrl = `/legislators/${legislator.slug}?meetingTerm=${
        filterValues.meeting
      }&sessionTerm=${JSON.stringify(sessionTermValue)}`
      router.push(newUrl)
      setIsFilterOpen(false)
    } catch (error) {
      console.error('Error processing filter values:', error)
    }
  }

  return (
    <LegislatorWrapper>
      <FunctionBarWrapper
        $isHeaderHidden={isHeaderHidden}
        $isHidden={isControllBarHidden}
      >
        <FunctionBar>
          <FunctionBarTitle text={`${legislator.name} 的相關發言摘要`} />
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
      <LegislatorContainer>
        <LeadingContainer ref={leadingRef}>
          <LegislatorTitle text={`${legislator.name} 的相關發言摘要`} />
          <FilterBar onClick={openFilter}>
            <P1Gray700
              text={`第${currentMeetingTerm}屆｜${
                filterValues.meetingSession.includes('all') ? '全部' : '部分'
              }會期`}
            />
            <FilterButton filterCount={filterCount} />
          </FilterBar>
        </LeadingContainer>
        <DesktopAndAbove>
          <ContentBlock>
            <DesktopAsideLeft>
              <LegislatorInfo legislator={legislator} />
              <Feedback />
            </DesktopAsideLeft>
            <DesktopAsideRight>
              <LegislatorStatistics committees={legislator.committees} />
              <ListContainer>
                <LegislatorList
                  legislatorSlug={legislator.slug}
                  topics={topics}
                  speechesByTopic={speechesByTopic}
                  currentMeetingTerm={currentMeetingTerm}
                  currentMeetingSession={currentMeetingSession}
                />
              </ListContainer>
            </DesktopAsideRight>
          </ContentBlock>
        </DesktopAndAbove>
        <TabletAndBelow>
          <ContentBlock>
            <LegislatorInfo legislator={legislator} />
            <LegislatorStatistics committees={legislator.committees} />
            <ListContainer>
              <LegislatorList
                legislatorSlug={legislator.slug}
                topics={topics}
                speechesByTopic={speechesByTopic}
                currentMeetingTerm={currentMeetingTerm}
                currentMeetingSession={currentMeetingSession}
              />
            </ListContainer>
            <Feedback />
          </ContentBlock>
        </TabletAndBelow>
      </LegislatorContainer>
      <FilterModal
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        onSubmit={handleSubmit}
        options={filterOptions}
        value={filterValues}
        onChange={handleFilterValueChange}
      />
    </LegislatorWrapper>
  )
}

export default Legislator
