'use client'
import React, { useMemo, useState, useCallback } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
// Common components
import {
  Container,
  Title,
  Body,
  SummarySection,
} from '@/components/speech-summary-list/layout'
import TabNavigation from '@/components/speech-summary-list/tab-navigation'
import FollowMoreItems, {
  LegislatorContainer,
} from '@/components/speech-summary-list/follow-more-items'
//  components
import { groupSummary } from '@/components/sidebar'
import CardsOfTheYear, {
  type SummaryCardProps,
  type CardsOfTheYearProps,
} from '@/components/sidebar/card'
import {
  Legislator,
  type LegislatorProps,
} from '@/components/sidebar/followMore'
import { type TabProps } from '@/components/sidebar/tab'
// utils
import { fetchTopLegislatorsBySpeechCount } from '@/fetchers/legislator'
// lodash
import get from 'lodash/get'
const _ = {
  get,
}

type LegislatorListProps = {
  legislatorSlug: string
  topics: { name: string; slug: string; count: number }[]
  speechesByTopic: Record<
    string,
    { title: string; date: string; summary: string; slug: string }[]
  >
  currentMeetingTerm: number
  currentMeetingSession: number[]
}

const LegislatorList: React.FC<LegislatorListProps> = ({
  legislatorSlug,
  topics,
  speechesByTopic,
  currentMeetingTerm,
  currentMeetingSession,
}) => {
  const [selectedTab, setSelectedTab] = useState(0)

  const tabs: TabProps[] = useMemo(() => topics.map((topic) => topic), [topics])
  const selectedTopic = useMemo(() => {
    if (topics.length === 0) return null
    return topics[selectedTab] || topics[0]
  }, [topics, selectedTab])
  const followMoreTitle: string = useMemo(
    () => `關注 ${_.get(selectedTopic, ['name'], '')} 主題的其他人：`,
    [selectedTopic]
  )
  const summaryList: SummaryCardProps[] = useMemo(() => {
    if (!selectedTopic) return []
    return speechesByTopic[selectedTopic.slug].map(
      ({ title, date, summary, slug }) => ({
        title,
        date: new Date(date),
        summary,
        slug,
      })
    )
  }, [selectedTopic, speechesByTopic])
  const summaryGroupByYear: CardsOfTheYearProps[] = useMemo(
    () => groupSummary(summaryList),
    [summaryList]
  )

  const { data: topLegislators, error: topLegislatorsError } = useSWR(
    selectedTopic?.slug
      ? [
          'fetchTopLegislatorsBySpeechCount',
          selectedTopic.slug,
          currentMeetingTerm,
          currentMeetingSession,
        ]
      : null,
    () =>
      selectedTopic?.slug
        ? fetchTopLegislatorsBySpeechCount({
            topicSlug: selectedTopic.slug,
            legislativeMeetingTerm: currentMeetingTerm,
            legislativeMeetingSessionTerms: currentMeetingSession,
            legislatorSlug,
          })
        : null
  )

  const legislatorList: LegislatorProps[] = useMemo(() => {
    if (!selectedTopic) return []
    if (topLegislatorsError) return []
    if (!topLegislators) return []

    return topLegislators
  }, [selectedTopic, topLegislators, topLegislatorsError])

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
          {legislatorList.length > 0 ? (
            <LegislatorContainer>
              {legislatorList.map((props, index: number) => (
                <Link
                  href={`/legislators/${props.slug}`}
                  key={`follow-more-legislator-${index}`}
                >
                  <Legislator
                    {...props}
                    key={`follow-more-legislator-${index}`}
                  />
                </Link>
              ))}
            </LegislatorContainer>
          ) : null}
        </FollowMoreItems>
      </Body>
    </Container>
  )
}

export default React.memo(LegislatorList)
