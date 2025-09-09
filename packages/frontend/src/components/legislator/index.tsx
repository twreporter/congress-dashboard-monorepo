'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
// type
import {
  type LegislatorFromRes,
  type TopicData,
} from '@/fetchers/server/legislator'
// fetcher
import { useLegislativeMeeting } from '@/fetchers/legislative-meeting'
// hooks
import { useLegislatorData } from '@/components/legislator/hooks/use-legislator-data'
// custom hooks
import { useLegislativeMeetingFilters } from '@/hooks/use-filters'
// constants
import { InternalRoutes } from '@/constants/routes'

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
  const searchParams = useSearchParams()
  const [filterCount, setFilterCount] = useState<number>(0)
  const [isLegislatorActive, setIsLegislatorActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { legislator, topics, speechesByTopic } = useLegislatorData(
    legislatorData,
    topicsData
  )

  const {
    isFilterOpen,
    setIsFilterOpen,
    filterValues,
    handleFilterValueChange,
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
      setIsLoading(true)
      setIsFilterOpen(false)
      router.push(newUrl)
    } catch (error) {
      console.error('Error processing filter values:', error)
    }
  }

  const pageTitle = `${legislator.name} 的相關發言摘要`

  useEffect(() => {
    const sessionTermParam = searchParams.get('sessionTerm')
    if (sessionTermParam) {
      try {
        const sessionTermArray = JSON.parse(sessionTermParam)
        if (Array.isArray(sessionTermArray)) {
          if (
            sessionTermArray.length >=
            legislativeMeetingSessionState.legislativeMeetingSessions.length
          ) {
            setFilterCount(0)
          } else {
            setFilterCount(sessionTermArray.length)
          }
        }
      } catch (error) {
        console.error('Error parsing sessionTerm from URL:', error)
        setFilterCount(0)
      }
    } else {
      setFilterCount(0)
    }
  }, [searchParams, legislativeMeetingSessionState])

  useEffect(() => {
    setIsLoading(false)
  }, [legislator, topics, speechesByTopic])

  const { legislativeMeetings } = useLegislativeMeeting()
  useEffect(() => {
    // if the legislator's meeting term matches the latest meeting term, set isLegislatorActive to true
    if (
      legislatorData.legislativeMeeting.term === legislativeMeetings[0]?.term
    ) {
      setIsLegislatorActive(true)
    } else {
      setIsLegislatorActive(false)
    }
  }, [legislativeMeetings, legislatorData])

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
                isLoading={isLoading}
                legislatorSlug={legislator.slug}
                legislatorName={legislator.name}
                legislatorNote={legislator.note}
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
                isLoading={isLoading}
                legislatorSlug={legislator.slug}
                legislatorName={legislator.name}
                legislatorNote={legislator.note}
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
