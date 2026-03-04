'use client'
import React, { useMemo, useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
// hooks
import useFollowMore from '@/components/councilor/hook/use-follow-more'
// fetchers
import { fetchTopicsOfACouncilor } from '@/fetchers/councilor'
// Common components
import {
  Container,
  Title,
  Body,
  SummarySection,
  EmptyState,
  EmptyStateColumn,
  EmptyStateTitle,
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
import { Legislator } from '@/components/sidebar/follow-more'
import { Loader } from '@/components/loader'
import FilterModal from '@/components/sidebar/filter-modal'
import { FollowMoreErrorState } from '@/components/sidebar/error-state'
// type
import type { TabProps } from '@/components/sidebar/type'
import type { Topic } from '@/types/topic'
import type { BillMeta } from '@/types/council-bill'
import type { CouncilDistrict } from '@/types/council'
// constants
import { InternalRoutes } from '@/constants/routes'
// style
import {
  LegislatorContainer,
  FilterMask,
  FilterBox,
} from '@/components/legislator/legislator-list'

const maxTabs = 5
const mapToTabItems = (items: TabProps[]): TabProps[] =>
  items.map((item) => ({ ...item, showAvatar: false }))

const prepareSummaryProps = (bills: BillMeta[]): SummaryCardProps[] =>
  bills.map(({ title, date, summaryFallback, slug }) => ({
    title,
    date: new Date(date),
    summary: summaryFallback || '',
    slug,
  }))

type TopicListProps = {
  districtSlug: CouncilDistrict
  councilor: {
    slug: string
    name: string
    note?: string
  }
  topics: Topic[]
  billsByTopic: Record<string, BillMeta[]>
  isLoading?: boolean
}

const TopicList: React.FC<TopicListProps> = ({
  districtSlug,
  councilor,
  topics,
  billsByTopic,
  isLoading = true,
}) => {
  const [selectedTab, setSelectedTab] = useState(0)
  const [showFilter, setShowFilter] = useState(false)

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

  const followMoreTitle = useMemo(
    () => (selectedTopic ? `關注 ${selectedTopic.name} 議題的其他人：` : ''),
    [selectedTopic]
  )

  const summaryGroupByYear = useMemo(() => {
    if (!selectedTopic) return []
    return groupSummary(prepareSummaryProps(billsByTopic[selectedTopic.slug]))
  }, [selectedTopic, billsByTopic])

  const {
    topCouncilors,
    error: swrError,
    isLoading: isFollowMoreLoading,
  } = useFollowMore(
    selectedTopic
      ? {
          topicSlug: selectedTopic.slug,
          excludeCouncilorSlug: councilor.slug,
          districtSlug,
        }
      : null
  )

  const followMoreList = useMemo(
    () => (!swrError && selectedTopic ? topCouncilors.filter(({ count }) => count > 0) : []),
    [swrError, selectedTopic, topCouncilors]
  )

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
        <Title $isEmpty={true} text="議案" />
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
        <Title $isEmpty={true} text="議案" />
        <Body>
          <EmptyStateColumn>
            <EmptyStateTitle text="本屆期無議案資訊" />
            {councilor.note ? <EmptyStateText text={councilor.note} /> : null}
          </EmptyStateColumn>
        </Body>
      </Container>
    )
  }

  return (
    <Container>
      <Title text="議案" />
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
              <CardsOfTheYear
                {...props}
                type="bill"
                key={`summary-of-the-year-${index}`}
              />
            )
          )}
        </SummarySection>
        <FollowMoreItems title={followMoreTitle}>
          {isFollowMoreLoading && <Loader useAbsolute={false} />}
          {!isFollowMoreLoading && swrError && <FollowMoreErrorState />}
          {followMoreList.length > 0 ? (
            <LegislatorContainer>
              {followMoreList.map((councilor, index: number) => (
                <Link
                  href={`${InternalRoutes.Councilor(districtSlug)}/${
                    councilor.slug
                  }`}
                  key={`follow-more-councilor-${index}`}
                >
                  <Legislator {...councilor} />
                </Link>
              ))}
            </LegislatorContainer>
          ) : null}
        </FollowMoreItems>
      </Body>
      <FilterMask $show={showFilter}>
        <FilterBox $show={showFilter}>
          <FilterModal
            title={`${councilor.name} 的相關議題篩選`}
            slug={councilor.slug}
            initialOption={topics}
            placeholder={'篩選議題'}
            initialSelectedOption={tabList}
            fetcher={(slug) =>
              fetchTopicsOfACouncilor({ councilorSlug: slug, districtSlug })
            }
            onClose={closeFilter}
            onConfirmSelection={handleFilterConfirm}
          />
        </FilterBox>
      </FilterMask>
    </Container>
  )
}

export default React.memo(TopicList)
