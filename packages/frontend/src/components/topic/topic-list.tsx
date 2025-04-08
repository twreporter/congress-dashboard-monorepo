'use client'
import React, { useMemo, useState, useCallback } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import Link from 'next/link'
// Common components
import {
  Container,
  Title,
  Body,
  SummarySection,
} from '@/components/layout/speech-summary-list/layout'
import TabNavigation from '@/components/layout/speech-summary-list/tab-navigation'
import FollowMoreItems from '@/components/layout/speech-summary-list/follow-more-items'
//  compoents
import { groupSummary } from '@/components/sidebar'
import CardsOfTheYear, {
  type SummaryCardProps,
  type CardsOfTheYearProps,
} from '@/components/sidebar/card'
import { Issue, type IssueProps } from '@/components/sidebar/follow-more'
import { type TabProps } from '@/components/sidebar/tab'
// constants
import { InternalRoutes } from '@/constants/navigation-link'
// fetcher
import { type SpeechData, fetchTopTopicsForLegislator } from '@/fetchers/topic'
// lodash
import get from 'lodash/get'
const _ = {
  get,
}

const TopicContainer = styled.div`
  gap: 12px;
  display: flex;
  flex-wrap: wrap;
  a {
    text-decoration: none;
  }
`

type LegislatorData = {
  name: string
  slug: string
  imageLink?: string
  count: number
}

type TopicListProps = {
  legislatorsData: LegislatorData[]
  speechesByLegislator: Record<string, SpeechData[]>
  currentMeetingTerm: number
  currentMeetingSession: number[]
}

const TopicList: React.FC<TopicListProps> = ({
  legislatorsData,
  speechesByLegislator,
  currentMeetingTerm,
  currentMeetingSession,
}) => {
  const [selectedTab, setSelectedTab] = useState(0)
  const tabs: TabProps[] = useMemo(
    () => legislatorsData.map((legislator) => legislator),
    [legislatorsData]
  )
  const selectedLegislator = useMemo(() => {
    if (legislatorsData.length === 0) return null
    return legislatorsData[selectedTab] || legislatorsData[0]
  }, [legislatorsData, selectedTab])
  const summaryList: SummaryCardProps[] = useMemo(() => {
    if (!selectedLegislator) return []
    return speechesByLegislator[selectedLegislator.slug].map(
      ({ title, date, summary, slug }) => ({
        title,
        date: new Date(date),
        summary,
        slug,
      })
    )
  }, [selectedLegislator, speechesByLegislator])
  const { data: topTopics, error: topTopicsError } = useSWR(
    selectedLegislator?.slug
      ? [
          'fetchTopTopicsForLegislator',
          selectedLegislator.slug,
          currentMeetingTerm,
          currentMeetingSession,
        ]
      : null,
    () =>
      selectedLegislator?.slug
        ? fetchTopTopicsForLegislator({
            legislatorSlug: selectedLegislator.slug,
            legislativeMeeting: currentMeetingTerm,
            legislativeMeetingSession: currentMeetingSession,
          })
        : null
  )
  const issueList: (IssueProps & { slug: string })[] = useMemo(() => {
    if (!selectedLegislator) return []
    if (topTopicsError) return []
    if (!topTopics) return []

    return topTopics.map((topic) => ({
      name: topic.title,
      slug: topic.slug,
      count: topic.speechesCount,
    }))
  }, [selectedLegislator, topTopics, topTopicsError])
  const followMoreTitle: string = useMemo(
    () => `${_.get(selectedLegislator, ['name'], '')} 近期關注的五大議題：`,
    [selectedLegislator]
  )
  const summaryGroupByYear: CardsOfTheYearProps[] = useMemo(
    () => groupSummary(summaryList),
    [summaryList]
  )
  const openFilter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    alert(`open filter modal`)
  }, [])
  const handleTabChange = useCallback((index: number) => {
    setSelectedTab(index)
  }, [])

  return (
    <Container>
      <Title text="發言摘要" />
      <TabNavigation
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={handleTabChange}
        onFilterClick={openFilter}
      />
      <Body>
        <SummarySection>
          {summaryGroupByYear.map(
            (props: CardsOfTheYearProps, index: number) => (
              <CardsOfTheYear {...props} key={`summary-of-the-year-${index}`} />
            )
          )}
        </SummarySection>
        <FollowMoreItems title={followMoreTitle}>
          {issueList.length > 0 ? (
            <TopicContainer>
              {issueList.map((props, index: number) => (
                <Link
                  href={`${InternalRoutes.Topic}/${
                    props.slug
                  }?meetingTerm=${currentMeetingTerm}&sessionTerm=${JSON.stringify(
                    currentMeetingSession
                  )}`}
                  key={`follow-more-issue-${index}`}
                >
                  <Issue {...props} />
                </Link>
              ))}
            </TopicContainer>
          ) : null}
        </FollowMoreItems>
      </Body>
    </Container>
  )
}

export default React.memo(TopicList)
