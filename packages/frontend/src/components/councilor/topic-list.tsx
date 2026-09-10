'use client'

import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import useFollowMore from '@/components/councilor/hook/use-follow-more'
import useCouncilWork from '@/fetchers/council-work'
import {
  Container,
  Title,
  Body,
  SummarySection,
  EmptyStateColumn,
  EmptyStateText,
} from '@/components/layout/speech-summary-list/layout'
import TabNavigation from '@/components/layout/speech-summary-list/tab-navigation'
import FollowMoreItems from '@/components/layout/speech-summary-list/follow-more-items'
import CardsOfTheYear, {
  type SummaryCardProps,
  type CardsOfTheYearProps,
} from '@/components/sidebar/card'
import { Legislator } from '@/components/sidebar/follow-more'
import { Loader } from '@/components/loader'
import FilterModal from '@/components/sidebar/filter-modal'
import {
  BodyErrorState,
  FollowMoreErrorState,
} from '@/components/sidebar/error-state'
import type { TabProps } from '@/components/sidebar/type'
import type { CouncilTopicForFilter } from '@/types/council-topic'
import type { CouncilDistrict } from '@/types/council'
import type { CouncilWorkMeta } from '@/types/council-work'
import { InternalRoutes } from '@/constants/routes'
import {
  filterCouncilWork,
  groupCouncilWorkByMonth,
  type WorkFilter,
} from '@/utils/council-work'
import {
  LegislatorContainer,
  FilterMask,
  FilterBox,
} from '@/components/legislator/legislator-list'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
import { ZIndex } from '@/styles/z-index'
import ContentFilterControl from '@/components/councilor/content-filter-control'

const maxTabs = 5
const workFilterLabel: Record<WorkFilter, string> = {
  all: '發言與議案',
  speech: '發言',
  bill: '議案',
}

const SummaryCount = styled(P2)`
  color: ${colorGrayscale.gray700};
`

const FixedContentFilter = styled.div<{ $show: boolean }>`
  display: ${(props) => (props.$show ? 'flex' : 'none')};
  position: fixed;
  z-index: ${ZIndex.Tooltip};
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
`

const InlineContentFilter = styled.div`
  display: flex;
  justify-content: center;
`

const mapToTabItems = (items: CouncilTopicForFilter[]): TabProps[] =>
  items.map((item) => ({ ...item, showAvatar: false, showCount: false }))

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
  councilor: {
    slug: string
    name: string
    note?: string
  }
  topics: CouncilTopicForFilter[]
}

const TopicList: React.FC<TopicListProps> = ({
  districtSlug,
  councilMeetingId,
  councilor,
  topics,
}) => {
  const [selectedTab, setSelectedTab] = useState(0)
  const [showFilter, setShowFilter] = useState(false)
  const [workFilter, setWorkFilter] = useState<WorkFilter>('all')
  const [isInlineFilterVisible, setIsInlineFilterVisible] = useState(false)
  const inlineFilterRef = useRef<HTMLDivElement>(null)

  const [tabList, setTabList] = useState(() =>
    mapToTabItems(topics).slice(0, maxTabs)
  )

  useEffect(() => {
    setTabList(mapToTabItems(topics).slice(0, maxTabs))
    setSelectedTab(0)
  }, [topics])

  const selectedTopic = useMemo(() => {
    if (topics.length === 0 || !tabList[selectedTab]) return null
    const currentSlug = tabList[selectedTab].slug
    return topics.find((topic) => topic.slug === currentSlug) || null
  }, [topics, selectedTab, tabList])

  const workState = useCouncilWork(
    selectedTopic?.slug
      ? {
          councilorSlug: councilor.slug,
          topicSlug: selectedTopic.slug,
          councilMeetingId,
        }
      : undefined
  )

  useEffect(() => {
    const target = inlineFilterRef.current
    if (!target) {
      setIsInlineFilterVisible(false)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsInlineFilterVisible(entry.isIntersecting),
      { threshold: 0.5 }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [selectedTab, workState.isLoading])

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

  const followMoreTitle = useMemo(
    () => (selectedTopic ? `關注 ${selectedTopic.name} 主題的其他人：` : ''),
    [selectedTopic]
  )

  const {
    topCouncilors,
    error: swrError,
    isLoading: isFollowMoreLoading,
  } = useFollowMore(
    selectedTopic?.slug
      ? {
          topicSlug: selectedTopic.slug,
          excludeCouncilorSlug: councilor.slug,
          districtSlug,
        }
      : null
  )

  const followMoreList = useMemo(
    () => (!swrError && selectedTopic ? topCouncilors : []),
    [swrError, selectedTopic, topCouncilors]
  )

  const openFilter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setShowFilter(true)
  }, [])

  const handleTabChange = useCallback((index: number) => {
    setSelectedTab(index)
    setWorkFilter('all')
  }, [])

  const handleFilterConfirm = useCallback((filterList: TabProps[]) => {
    setTabList(
      filterList.map((topic) => ({
        ...topic,
        showAvatar: false,
        showCount: false,
      }))
    )
    setSelectedTab(0)
    setWorkFilter('all')
  }, [])

  const closeFilter = useCallback(() => setShowFilter(false), [])

  if (topics.length === 0) {
    return (
      <Container>
        <Title $isEmpty={true} text="發言與議案" />
        <Body>
          <EmptyStateColumn>
            <EmptyStateText text="本屆期無發言與議案資訊" />
            {councilor.note ? <EmptyStateText text={councilor.note} /> : null}
          </EmptyStateColumn>
        </Body>
      </Container>
    )
  }

  return (
    <Container>
      <Title $isEmpty={false} text="發言與議案" />
      <TabNavigation
        tabs={tabList}
        selectedTab={selectedTab}
        setSelectedTab={handleTabChange}
        onFilterClick={openFilter}
      />
      <Body>
        {workState.isLoading ? <Loader useAbsolute={false} /> : null}
        {workState.error ? <BodyErrorState /> : null}
        {!workState.isLoading && !workState.error ? (
          <>
            <SummarySection>
              <SummaryCount
                text={`共 ${workState.speechCount} 筆發言、${workState.billCount} 筆議案`}
              />
              {workByMonth.length === 0 ? (
                <EmptyStateColumn>
                  <EmptyStateText
                    text={`本屆期尚無此議題的${workFilterLabel[workFilter]}資訊`}
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
            <InlineContentFilter ref={inlineFilterRef}>
              <ContentFilterControl
                value={workFilter}
                onChange={setWorkFilter}
              />
            </InlineContentFilter>
          </>
        ) : null}
        <FollowMoreItems title={followMoreTitle}>
          {isFollowMoreLoading && <Loader useAbsolute={false} />}
          {!isFollowMoreLoading && swrError && <FollowMoreErrorState />}
          {followMoreList.length > 0 ? (
            <LegislatorContainer>
              {followMoreList.map((otherCouncilor) => (
                <Link
                  href={`${InternalRoutes.Councilor(districtSlug)}/${
                    otherCouncilor.slug
                  }`}
                  key={`follow-more-councilor-${otherCouncilor.slug}`}
                >
                  <Legislator {...otherCouncilor} showCount={false} />
                </Link>
              ))}
            </LegislatorContainer>
          ) : null}
        </FollowMoreItems>
      </Body>
      <FixedContentFilter
        $show={
          !isInlineFilterVisible &&
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
              title={`${councilor.name} 的相關議題篩選`}
              slug={councilor.slug}
              initialOption={topics}
              placeholder="篩選議題"
              initialSelectedOption={tabList}
              includeZeroCountOptions={true}
              showOptionCount={false}
              groupOptionsByFeatured={true}
              onClose={closeFilter}
              onConfirmSelection={handleFilterConfirm}
            />
          ) : null}
        </FilterBox>
      </FilterMask>
    </Container>
  )
}

export default React.memo(TopicList)
