'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import useFollowMore from '@/components/council-topic/hook/use-follow-more'
import useCouncilWork from '@/fetchers/council-work'
import {
  Body,
  Container,
  EmptyStateColumn,
  EmptyStateText,
  SummarySection,
  Title,
} from '@/components/layout/speech-summary-list/layout'
import TabNavigation from '@/components/layout/speech-summary-list/tab-navigation'
import FollowMoreItems from '@/components/layout/speech-summary-list/follow-more-items'
import CardsOfTheYear, {
  type CardsOfTheYearProps,
  type SummaryCardProps,
} from '@/components/sidebar/card'
import { TopicContainer } from '@/components/topic/topic-list'
import { Issue } from '@/components/sidebar/follow-more'
import { Loader } from '@/components/loader'
import FilterModal from '@/components/sidebar/filter-modal'
import {
  BodyErrorState,
  FollowMoreErrorState,
} from '@/components/sidebar/error-state'
import ContentFilterControl from '@/components/councilor/content-filter-control'
import type { TabProps } from '@/components/sidebar/type'
import type { CouncilorWithWorkCounts } from '@/types/councilor'
import type { CouncilDistrict } from '@/types/council'
import type { CouncilWorkMeta } from '@/types/council-work'
import { InternalRoutes } from '@/constants/routes'
import {
  filterCouncilWork,
  groupCouncilWorkByMonth,
  type WorkFilter,
} from '@/utils/council-work'
import { FilterBox, FilterMask } from '@/components/legislator/legislator-list'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import { ZIndex } from '@/styles/z-index'
import useFloatingContentFilter from '@/components/councilor/hook/use-floating-content-filter'
import mq from '@twreporter/core/lib/utils/media-query'

const maxTabs = 5
const workFilterLabel: Record<WorkFilter, string> = {
  all: '發言與議案',
  speech: '發言',
  bill: '議案',
}

const SummaryCount = styled(P1)`
  color: ${colorGrayscale.gray700};
  margin-bottom: -16px !important;
`

const FixedContentFilter = styled.div<{ $show: boolean; $left: number | null }>`
  display: flex;
  visibility: ${(props) =>
    props.$show && props.$left !== null ? 'visible' : 'hidden'};
  pointer-events: ${(props) =>
    props.$show && props.$left !== null ? 'auto' : 'none'};
  position: fixed;
  z-index: ${ZIndex.Tooltip};
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  left: ${(props) => props.$left ?? 0}px;
  transform: translateX(-50%);

  ${mq.tabletAndBelow`
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  `}
`

const InlineContentFilter = styled.div<{ $hidden: boolean }>`
  display: flex;
  justify-content: center;
  visibility: ${(props) => (props.$hidden ? 'hidden' : 'visible')};
`

const mapToTabItems = (items: CouncilorWithWorkCounts[]): TabProps[] =>
  items.map(({ speechCount, billCount: _billCount, ...item }) => ({
    ...item,
    count: speechCount,
    showAvatar: true,
    showCount: false,
  }))

const prepareWorkCardProps = (work: CouncilWorkMeta[]): SummaryCardProps[] =>
  work.map(({ summaryFallback, ...item }) => ({
    ...item,
    summary: summaryFallback || '',
    showTypeBadge: true,
    isCouncil: true,
  }))

type TopicListProps = {
  districtSlug: CouncilDistrict
  councilMeetingId: number
  topic: {
    slug: string
    title: string
  }
  councilors: CouncilorWithWorkCounts[]
}

const TopicList: React.FC<TopicListProps> = ({
  districtSlug,
  councilMeetingId,
  topic,
  councilors,
}) => {
  const [selectedTab, setSelectedTab] = useState(0)
  const [showFilter, setShowFilter] = useState(false)
  const [workFilter, setWorkFilter] = useState<WorkFilter>('all')
  const [tabList, setTabList] = useState(() =>
    mapToTabItems(councilors).slice(0, maxTabs)
  )

  useEffect(() => {
    setTabList(mapToTabItems(councilors).slice(0, maxTabs))
    setSelectedTab(0)
  }, [councilors])

  const selectedCouncilor = useMemo(() => {
    const slug = tabList[selectedTab]?.slug
    return councilors.find((councilor) => councilor.slug === slug) || null
  }, [councilors, selectedTab, tabList])

  const workState = useCouncilWork(
    selectedCouncilor
      ? {
          councilorSlug: selectedCouncilor.slug,
          topicSlug: topic.slug,
          councilMeetingId,
        }
      : undefined
  )
  const {
    topicListRef,
    inlineFilterRef,
    fixedFilterRef,
    isInlineFilterActive,
    isWithinFloatingRange,
    filterCenter,
  } = useFloatingContentFilter(
    `${selectedTab}-${workState.isLoading}-${workState.error ? 'error' : 'ok'}`
  )

  const filteredWork = useMemo(
    () => filterCouncilWork(workState.work, workFilter),
    [workFilter, workState.work]
  )
  const workByMonth: CardsOfTheYearProps[] = useMemo(
    () =>
      groupCouncilWorkByMonth(prepareWorkCardProps(filteredWork)).map(
        ({ period, cards }) => ({ period, cards, year: 0 })
      ),
    [filteredWork]
  )

  const followMoreTitle = selectedCouncilor
    ? `${selectedCouncilor.name} 近期關注的五大議題：`
    : ''
  const {
    topTopics,
    error: followMoreError,
    isLoading: isFollowMoreLoading,
  } = useFollowMore(
    selectedCouncilor
      ? {
          councilorSlug: selectedCouncilor.slug,
          excludeTopicSlug: topic.slug,
          districtSlug,
        }
      : null
  )

  const handleTabChange = useCallback((index: number) => {
    setSelectedTab(index)
    setWorkFilter('all')
  }, [])
  const handleFilterConfirm = useCallback((items: TabProps[]) => {
    setTabList(
      items.map((item) => ({
        ...item,
        showAvatar: true,
        showCount: false,
      }))
    )
    setSelectedTab(0)
    setWorkFilter('all')
  }, [])

  if (councilors.length === 0) {
    return (
      <Container>
        <Title $isEmpty={true} text="發言與議案" />
        <Body>
          <EmptyStateColumn>
            <EmptyStateText text="本屆期無發言與議案資訊" />
          </EmptyStateColumn>
        </Body>
      </Container>
    )
  }

  return (
    <Container ref={topicListRef}>
      <Title $isEmpty={false} text="發言與議案" />
      <TabNavigation
        tabs={tabList}
        selectedTab={selectedTab}
        setSelectedTab={handleTabChange}
        onFilterClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setShowFilter(true)
        }}
      />
      <Body>
        {workState.isLoading ? <Loader useAbsolute={false} /> : null}
        {workState.error ? <BodyErrorState /> : null}
        {!workState.isLoading && !workState.error ? (
          <>
            <SummarySection>
              <SummaryCount
                weight={P1.Weight.BOLD}
                text={`共 ${workState.speechCount} 筆發言、${workState.billCount} 筆議案`}
              />
              {workByMonth.length === 0 ? (
                <EmptyStateColumn>
                  <EmptyStateText
                    text={`所選議員在本屆期無${workFilterLabel[workFilter]}資訊`}
                  />
                </EmptyStateColumn>
              ) : (
                workByMonth.map((props, index) => (
                  <CardsOfTheYear
                    {...props}
                    key={`summary-of-the-month-${index}`}
                  />
                ))
              )}
            </SummarySection>
            <InlineContentFilter
              ref={inlineFilterRef}
              $hidden={isWithinFloatingRange && !isInlineFilterActive}
            >
              <ContentFilterControl
                value={workFilter}
                onChange={setWorkFilter}
              />
            </InlineContentFilter>
          </>
        ) : null}
        <FollowMoreItems title={followMoreTitle}>
          {isFollowMoreLoading ? <Loader useAbsolute={false} /> : null}
          {!isFollowMoreLoading && followMoreError ? (
            <FollowMoreErrorState />
          ) : null}
          {!followMoreError && topTopics.length > 0 ? (
            <TopicContainer>
              {topTopics.map((otherTopic) => (
                <Link
                  href={`${InternalRoutes.CouncilTopic(districtSlug)}/${
                    otherTopic.slug
                  }`}
                  key={`follow-more-topic-${otherTopic.slug}`}
                >
                  <Issue {...otherTopic} />
                </Link>
              ))}
            </TopicContainer>
          ) : null}
        </FollowMoreItems>
      </Body>
      <FixedContentFilter
        ref={fixedFilterRef}
        $left={filterCenter}
        $show={
          !isInlineFilterActive &&
          isWithinFloatingRange &&
          !showFilter &&
          !workState.isLoading &&
          !workState.error
        }
      >
        <ContentFilterControl value={workFilter} onChange={setWorkFilter} />
      </FixedContentFilter>
      <FilterMask $show={showFilter}>
        <FilterBox $show={showFilter}>
          {showFilter ? (
            <FilterModal
              title={`${topic.title} 的相關發言與議案篩選`}
              slug={topic.slug}
              initialOption={mapToTabItems(councilors)}
              placeholder="篩選議員"
              initialSelectedOption={tabList}
              includeZeroCountOptions={true}
              showOptionCount={false}
              onClose={() => setShowFilter(false)}
              onConfirmSelection={handleFilterConfirm}
            />
          ) : null}
        </FilterBox>
      </FilterMask>
    </Container>
  )
}

export default React.memo(TopicList)
