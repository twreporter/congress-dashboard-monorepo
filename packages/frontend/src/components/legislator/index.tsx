'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// @twreporter
import { TabletAndBelow } from '@twreporter/react-components/lib/rwd'
// components
import LegislatorInfo from '@/components/legislator/legislator-info'
import LegislatorStatistics from '@/components/legislator/legislator-statistics'
import LegislatorList from '@/components/legislator/legislator-list'
import Feedback from '@/components/topic/topic-feedback'
import FilterModal from '@/components/filter-modal'
import ContentPageLayout from '@/components/layout/content-page-layout'
// styles
import {
  ContentBlock,
  DesktopContainer,
  DesktopAsideLeft,
  DesktopAsideRight,
  ListContainer,
} from '@/components/legislator/styles'
// fetcher
import {
  type LegislatorFromRes,
  type TopicData,
} from '@/fetchers/server/legislator'
// hooks
import { useLegislatorData } from '@/components/legislator/hooks/use-legislator-data'
// custom hooks
import { useLegislativeMeetingFilters } from '@/hooks/use-filters'
// constants
import { InternalRoutes } from '@/constants/navigation-link'

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
  const [filterCount, setFilterCount] = useState<number>(0)
  const [isLegislatorActive, setIsLegislatorActive] = useState<boolean>(false)

  const { legislator, topics, speechesByTopic } = useLegislatorData(
    legislatorData,
    topicsData
  )

  const {
    isFilterOpen,
    setIsFilterOpen,
    filterValues,
    handleFilterValueChange,
    legislativeMeetingState,
    legislativeMeetingSessionState,
    filterOptions,
  } = useLegislativeMeetingFilters({
    legislatorSlug: legislator.slug,
    currentMeetingTerm,
    currentMeetingSession,
  })

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

      const newUrl = `${InternalRoutes.Legislator}/${
        legislator.slug
      }?meetingTerm=${filterValues.meeting}&sessionTerm=${JSON.stringify(
        sessionTermValue
      )}`
      router.push(newUrl)
      setIsFilterOpen(false)
    } catch (error) {
      console.error('Error processing filter values:', error)
    }
  }

  const pageTitle = `${legislator.name} 的相關發言摘要`

  useEffect(() => {
    if (legislativeMeetingSessionState.legislativeMeetingSessions?.length > 0) {
      const allAvailableSessions =
        legislativeMeetingSessionState.legislativeMeetingSessions.map(
          ({ term }) => term
        )
      const hasAllSessions =
        allAvailableSessions.length === currentMeetingSession.length &&
        allAvailableSessions.every((session) =>
          currentMeetingSession.includes(session)
        )
      if (hasAllSessions) {
        setFilterCount(0)
      } else {
        setFilterCount(currentMeetingSession.length)
      }
    }
  }, [currentMeetingTerm, currentMeetingSession])

  useEffect(() => {
    // if the legislator's meeting term matches the latest meeting term, set isLegislatorActive to true
    if (
      legislatorData.legislativeMeeting.term ===
      legislativeMeetingState?.legislativeMeeting[0]?.term
    ) {
      setIsLegislatorActive(true)
    } else {
      setIsLegislatorActive(false)
    }
  }, [legislativeMeetingState, legislatorData])

  return (
    <>
      <ContentPageLayout
        title={pageTitle}
        currentMeetingTerm={currentMeetingTerm}
        filterCount={filterCount}
        onFilterClick={openFilter}
      >
        <DesktopContainer>
          <DesktopAsideLeft>
            <LegislatorInfo
              legislator={legislator}
              isLegislatorActive={isLegislatorActive}
            />
            <Feedback />
          </DesktopAsideLeft>
          <DesktopAsideRight>
            <LegislatorStatistics
              committees={legislator.committees}
              proposalSuccessCount={legislator.proposalSuccessCount}
              meetingTermCount={legislator.meetingTermCount}
              meetingTermCountInfo={legislator.meetingTermCountInfo}
            />
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
        </DesktopContainer>
        <TabletAndBelow>
          <ContentBlock>
            <LegislatorInfo
              legislator={legislator}
              isLegislatorActive={isLegislatorActive}
            />
            <LegislatorStatistics
              committees={legislator.committees}
              proposalSuccessCount={legislator.proposalSuccessCount}
              meetingTermCount={legislator.meetingTermCount}
              meetingTermCountInfo={legislator.meetingTermCountInfo}
            />
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

export default Legislator
