'use client'
import React, { useMemo, useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import Link from 'next/link'
// @twreporter
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
// Common components
import {
  Container,
  Title,
  Body,
  SummarySection,
  EmptyState,
  EmptyStateText,
} from '@/components/layout/speech-summary-list/layout'
import TabNavigation from '@/components/layout/speech-summary-list/tab-navigation'
import FollowMoreItems from '@/components/layout/speech-summary-list/follow-more-items'
//  components
import { groupSummary } from '@/components/sidebar'
import CardsOfTheYear, {
  type SummaryCardProps,
  type CardsOfTheYearProps,
} from '@/components/sidebar/card'
import {
  Legislator,
  type LegislatorProps,
} from '@/components/sidebar/follow-more'
import { Loader } from '@/components/loader'
import FilterModal from '@/components/sidebar/filter-modal'
// type
import type { TabProps } from '@/components/sidebar/type'
// utils
import { fetchTopLegislatorsBySpeechCount } from '@/fetchers/legislator'
// constants
import { InternalRoutes } from '@/constants/routes'
// z-index
import { ZIndex } from '@/styles/z-index'

const LegislatorContainer = styled.div`
  gap: 32px;
  display: flex;
  overflow-x: scroll;
  scrollbar-width: none;
  a {
    text-decoration: none;
  }
`

const FilterMask = styled.div<{ $show: boolean }>`
  visibility: ${(props) => (props.$show ? 'visible' : 'hidden')};
  transition: visibility 0.3s ease-in-out;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${colorOpacity['black_0.2']};
  z-index: ${ZIndex.SideBar};
`

const FilterBox = styled.div<{ $show: boolean }>`
  transform: translateX(${(props) => (props.$show ? 0 : '100%')});
  transition: transform 0.3s ease-in-out;
  position: fixed;
  top: 0;
  right: 0;
  width: 520px;
  height: 100vh;
  background-color: ${colorGrayscale.white};
  overflow-x: hidden;
  box-shadow: 0px 0px 24px 0px ${colorOpacity['black_0.1']};
  z-index: ${ZIndex.SideBar};
  ${mq.mobileOnly`
    width: 100vw;
  `}
`

type LegislatorListProps = {
  isLoading?: boolean
  legislatorSlug: string
  legislatorName: string
  topics: { name: string; slug: string; count: number }[]
  speechesByTopic: Record<
    string,
    { title: string; date: string; summary: string; slug: string }[]
  >
  currentMeetingTerm: number
  currentMeetingSession: number[]
}

const LegislatorList: React.FC<LegislatorListProps> = ({
  isLoading = true,
  legislatorSlug,
  legislatorName,
  topics,
  speechesByTopic,
  currentMeetingTerm,
  currentMeetingSession,
}) => {
  const [selectedTab, setSelectedTab] = useState(0)
  const [showFilter, setShowFilter] = useState(false)
  const [tabList, setTabList] = useState(
    topics
      .map((topic) => ({ ...topic, showAvatar: false }))
      .slice(0, 5) as TabProps[]
  )

  useEffect(() => {
    setTabList(
      topics.map((topic) => ({ ...topic, showAvatar: false })).slice(0, 5)
    )
  }, [topics])

  const selectedTopic = useMemo(() => {
    if (topics.length === 0 || !tabList[selectedTab]) return null
    const currentSlug = tabList[selectedTab].slug
    return topics.find((topic) => topic.slug === currentSlug) || null
  }, [topics, selectedTab, tabList])

  const followMoreTitle = useMemo(
    () => (selectedTopic ? `${selectedTopic.name} 主題的其他人：` : ''),
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

  const {
    data: topLegislators,
    error: topLegislatorsError,
    isLoading: isLoadingTopLegislators,
  } = useSWR(
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
    setShowFilter(true)
  }, [])

  const handleTabChange = useCallback((index: number) => {
    setSelectedTab(index)
  }, [])

  const handleFilterConfirm = useCallback((filterList: TabProps[]) => {
    setTabList(filterList.map((topic) => ({ ...topic, showAvatar: false })))
    setSelectedTab(0)
  }, [])

  const closeFilter = useCallback(() => {
    setShowFilter(false)
  }, [])

  if (isLoading) {
    return (
      <Container>
        <Title $isEmpty={true} text="發言摘要" />
        <Body>
          <EmptyState>
            <Loader useAbsolute={false} />
          </EmptyState>
        </Body>
      </Container>
    )
  }

  if (topics.length === 0) {
    return (
      <Container>
        <Title $isEmpty={true} text="發言摘要" />
        <Body>
          <EmptyState>
            <EmptyStateText text="所選會期無發言資訊" />
          </EmptyState>
        </Body>
      </Container>
    )
  }

  return (
    <Container>
      <Title text="發言摘要" />
      <TabNavigation
        tabs={tabList}
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
          {isLoadingTopLegislators && <Loader useAbsolute={false} />}
          {legislatorList.length > 0 ? (
            <LegislatorContainer>
              {legislatorList.map((props, index: number) => (
                <Link
                  href={`${InternalRoutes.Legislator}/${
                    props.slug
                  }?meetingTerm=${currentMeetingTerm}&sessionTerm=${JSON.stringify(
                    currentMeetingSession
                  )}`}
                  key={`follow-more-legislator-${index}`}
                >
                  <Legislator {...props} />
                </Link>
              ))}
            </LegislatorContainer>
          ) : null}
        </FollowMoreItems>
      </Body>
      <FilterMask $show={showFilter}>
        <FilterBox $show={showFilter}>
          <FilterModal
            title={`${legislatorName} 的相關發言篩選`}
            slug={legislatorSlug}
            initialOption={topics}
            initialSelectedOption={tabList}
            onClose={closeFilter}
            onConfirmSelection={handleFilterConfirm}
          />
        </FilterBox>
      </FilterMask>
    </Container>
  )
}

export default React.memo(LegislatorList)
