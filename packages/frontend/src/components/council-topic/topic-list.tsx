'use client'
import React, { useMemo, useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
// hooks
import useFollowMore from '@/components/council-topic/hook/use-follow-more'
// fetchers
import { fetchCouncilorsOfATopic } from '@/fetchers/council-topic'
// Common components
import {
  Container,
  Title,
  Body,
  SummarySection,
  EmptyState,
  EmptyStateColumn,
  EmptyStateTitle,
} from '@/components/layout/speech-summary-list/layout'
import TabNavigation from '@/components/layout/speech-summary-list/tab-navigation'
import FollowMoreItems from '@/components/layout/speech-summary-list/follow-more-items'
//  components
import { groupSummary } from '@/components/sidebar'
import CardsOfTheYear, {
  type CardsOfTheYearProps,
} from '@/components/sidebar/card'
import { TopicContainer } from '@/components/topic/topic-list'
import { Issue } from '@/components/sidebar/follow-more'
import { Loader } from '@/components/loader'
import FilterModal from '@/components/sidebar/filter-modal'
import { FollowMoreErrorState } from '@/components/sidebar/error-state'
// type
import type { TabProps } from '@/components/sidebar/type'
import type { CouncilorWithBillCount } from '@/types/councilor'
import type { BillMeta } from '@/types/council-bill'
import type { CouncilDistrict } from '@/types/council'
// constants
import { InternalRoutes } from '@/constants/routes'
// style
import { FilterMask, FilterBox } from '@/components/legislator/legislator-list'

const maxTabs = 5
const mapToTabItems = (items: TabProps[]): TabProps[] =>
  items.map((item) => ({ ...item, showAvatar: true }))

type TopicListProps = {
  districtSlug: CouncilDistrict
  topic: {
    slug: string
    title: string
  }
  councilors: CouncilorWithBillCount[]
  billsByTopic: Record<string, BillMeta[]>
  isLoading?: boolean
}

const TopicList: React.FC<TopicListProps> = ({
  districtSlug,
  topic,
  councilors,
  billsByTopic,
  isLoading = true,
}) => {
  const [selectedTab, setSelectedTab] = useState(0)
  const [showFilter, setShowFilter] = useState(false)

  const [tabList, setTabList] = useState(() =>
    mapToTabItems(councilors).slice(0, maxTabs)
  )
  useEffect(() => {
    setTabList(mapToTabItems(councilors).slice(0, maxTabs))
    setSelectedTab(0)
  }, [councilors])

  const selectedTopic = useMemo(() => {
    if (councilors.length === 0 || !tabList[selectedTab]) return null
    const currentSlug = tabList[selectedTab].slug
    return councilors.find((topic) => topic.slug === currentSlug) || null
  }, [councilors, selectedTab, tabList])

  const followMoreTitle = useMemo(
    () => (selectedTopic ? `${selectedTopic.name} 近期關注的五大議題：` : ''),
    [selectedTopic]
  )

  const summaryGroupByYear = useMemo(() => {
    if (!selectedTopic) return []
    return groupSummary(
      billsByTopic[selectedTopic.slug].map(
        ({ title, date, summary, slug }) => ({
          title,
          date: new Date(date),
          summary,
          slug,
        })
      )
    )
  }, [selectedTopic, billsByTopic])

  const {
    topTopics,
    error: swrError,
    isLoading: isFollowMoreLoading,
  } = useFollowMore(
    selectedTopic
      ? {
          councilorSlug: selectedTopic.slug,
          excludeTopicSlug: topic.slug,
          districtSlug,
        }
      : null
  )

  const followMoreList = useMemo(
    () => (!swrError && selectedTopic ? topTopics : []),
    [swrError, selectedTopic, topTopics]
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

  if (councilors.length === 0) {
    return (
      <Container>
        <Title $isEmpty={true} text="議案" />
        <Body>
          <EmptyStateColumn>
            <EmptyStateTitle text="本屆期無議案資訊" />
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
          {followMoreList.length > 0 && (
            <TopicContainer>
              {followMoreList.map((topic, index) => (
                <Link
                  href={`${InternalRoutes.Council}/${districtSlug}${InternalRoutes.CouncilTopic}/${topic.slug}`}
                  key={`follow-more-topic-${index}`}
                >
                  <Issue
                    name={topic.title}
                    count={topic.count}
                    slug={topic.slug}
                  />
                </Link>
              ))}
            </TopicContainer>
          )}
        </FollowMoreItems>
      </Body>
      <FilterMask $show={showFilter}>
        <FilterBox $show={showFilter}>
          <FilterModal
            title={`${topic.title} 的相關議案篩選`}
            slug={topic.slug}
            initialOption={councilors}
            placeholder={'篩選議員'}
            initialSelectedOption={tabList}
            fetcher={(slug) =>
              fetchCouncilorsOfATopic({ topicSlug: slug, districtSlug })
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
