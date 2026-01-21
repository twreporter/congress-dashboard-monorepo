'use client'

import React, {
  useEffect,
  useMemo,
  useState,
  useContext,
  useRef,
  RefAttributes,
} from 'react'
import styled from 'styled-components'
import Link from 'next/link'
// type
import type { CouncilDistrict } from '@/types/council'
// context
import { CouncilDashboardContext } from '@/components/council-dashboard/context'
// fetcher
import {
  fetchTop5CouncilorOfATopic,
  fetchTopicsOfACouncilor,
} from '@/fetchers/councilor'
import useCouncilBill from '@/fetchers/council-bill'
// hook
import {
  useMoreCouncilTopics,
  useMoreCouncilors,
} from '@/components/council-dashboard/hook/use-follow-more'
// constants
import { InternalRoutes } from '@/constants/routes'
// components
import TitleSection, {
  TitleSectionProps,
} from '@/components/sidebar/title-section'
import CardsOfTheYear, {
  SummaryCardProps,
  CardsOfTheYearProps,
} from '@/components/sidebar/card'
import {
  Issue,
  IssueProps,
  Legislator,
  LegislatorProps,
} from '@/components/sidebar/follow-more'
import FilterModal from '@/components/sidebar/filter-modal'
import { Loader } from '@/components/loader'
import {
  BodyErrorState,
  FollowMoreErrorState,
} from '@/components/sidebar/error-state'
import NoIssueState from '@/components/sidebar/no-issue-state'
// @twreporter
import { H5 } from '@twreporter/react-components/lib/text/headline'
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
// lodash
import { get, groupBy, forEach } from 'lodash'
const _ = {
  get,
  groupBy,
  forEach,
}

// sidebar issue component
const Box = styled.div`
  width: 520px;
  height: 100vh;
  background-color: ${colorGrayscale.white};
  overflow: hidden;
  box-shadow: 0px 0px 24px 0px ${colorOpacity['black_0.1']};

  ${mq.tabletOnly`
    width: 50vw;
    max-width: 520px;  
  `}
`
const ContentBox = styled.div<{ $show: boolean }>`
  ${(props) => (props.$show ? '' : 'display: none;')}
`
const FilterBox = styled.div<{ $show: boolean }>`
  ${(props) => (props.$show ? '' : 'display: none;')}
  height: 100%;
  position: relative;
  overflow-y: hidden;
`
const Body = styled.div<{ $topBoxHeight: number }>`
  display: flex;
  padding: 24px 24px 40px 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  overflow-y: scroll;
  height: 100%;
  max-height: calc(100vh - ${(props) => props.$topBoxHeight}px);
`
const SummarySection = styled.div`
  gap: 32px;
  display: flex;
  flex-direction: column;
`
const FollowMoreSection = styled.div`
  border-top: 1px solid ${colorGrayscale.gray300};
  padding-top: 40px;
  gap: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
`
const FollowMoreTitle = styled(H5)`
  color: ${colorGrayscale.gray800};
`
const FollowMoreTags = styled.div`
  gap: 12px;
  display: flex;
  flex-wrap: wrap;
`

export function groupSummary(summaryList: SummaryCardProps[]) {
  const result: CardsOfTheYearProps[] = []
  const summaryGroupByYear = _.groupBy(summaryList, (summary) =>
    new Date(summary.date).getFullYear()
  )
  _.forEach(
    summaryGroupByYear,
    (summarys: SummaryCardProps[], year: number | string) =>
      result.push({ year: Number(year), cards: summarys })
  )

  return result
}

export interface SidebarIssueProps extends RefAttributes<HTMLDivElement> {
  title: TitleSectionProps['title']
  count?: TitleSectionProps['count']
  legislatorList?: TitleSectionProps['tabs'] & { id?: number }
  slug: string
  onClose?: () => void
  className?: string
  districtSlug: string
}
export const SidebarIssue: React.FC<SidebarIssueProps> = ({
  slug,
  title,
  count,
  legislatorList = [],
  onClose,
  className,
  ref,
  districtSlug,
}: SidebarIssueProps) => {
  const topRef = useRef<HTMLDivElement>(null)
  const [tabList, setTabList] = useState(legislatorList)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState(0)
  const [showFilter, setShowFilter] = useState(false)
  const selectedCouncilor = useMemo(
    () => _.get(tabList, selectedTab),
    [tabList, selectedTab]
  )
  const followMoreTitle: string = useMemo(
    () => `${_.get(selectedCouncilor, ['name'], '')} 最關注的五大議題：`,
    [selectedCouncilor]
  )
  const { formattedFilterValues } = useContext(CouncilDashboardContext)
  const billState = useCouncilBill(
    formattedFilterValues && selectedCouncilor
      ? {
          councilorSlug: selectedCouncilor.slug as string,
          topicSlug: slug,
          councilMeetingId: formattedFilterValues?.meetingId,
        }
      : undefined
  )
  const summaryList: SummaryCardProps[] = useMemo(
    () => billState.bills || [],
    [billState.bills]
  )
  const summaryGroupByYear: CardsOfTheYearProps[] = useMemo(
    () => groupSummary(summaryList),
    [summaryList]
  )
  const followMoreState = useMoreCouncilTopics(
    selectedCouncilor
      ? {
          councilorSlug: selectedCouncilor.slug as string,
          excludeTopicSlug: slug,
          city: districtSlug,
        }
      : undefined
  )
  const issueList: IssueProps[] = useMemo(
    () =>
      followMoreState.topics.map(({ slug, title, count }) => ({
        slug,
        name: title,
        count,
      })) || [],
    [followMoreState.topics]
  )

  const fetchFilterOptions = () => {
    return fetchTop5CouncilorOfATopic({
      topicSlug: slug,
      districtSlug: districtSlug as CouncilDistrict,
      excludeCouncilorSlug: '',
    })
  }

  useEffect(() => {
    setIsLoading(true)
  }, [slug, selectedTab])

  useEffect(() => {
    if (billState.bills != undefined) {
      setIsLoading(billState.isLoading)
    }
  }, [billState.bills, billState.isLoading])

  useEffect(() => {
    setSelectedTab(0)
  }, [tabList])

  useEffect(() => {
    if (legislatorList) {
      setTabList(legislatorList)
    }
  }, [legislatorList])

  return (
    <Box className={className} ref={ref}>
      <ContentBox $show={!showFilter}>
        <div ref={topRef}>
          <TitleSection
            title={title}
            count={count}
            tabs={tabList}
            showTabAvatar={true}
            link={`${InternalRoutes.CouncilTopic(districtSlug)}/${slug}`}
            onSelectTab={setSelectedTab}
            onOpenFilterModal={() => setShowFilter(true)}
            onClose={onClose}
          />
        </div>
        {isLoading ? <Loader /> : null}
        {billState.error ? <BodyErrorState /> : null}
        {!isLoading && !billState.error ? (
          <Body $topBoxHeight={topRef?.current?.offsetHeight || 0}>
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
            {followMoreState.isLoading ? null : (
              <FollowMoreSection>
                <FollowMoreTitle text={followMoreTitle} />
                {followMoreState.error ? (
                  <FollowMoreErrorState />
                ) : issueList.length > 0 ? (
                  <FollowMoreTags>
                    {issueList.map((props: IssueProps, index: number) => (
                      <Link
                        href={`${InternalRoutes.CouncilTopic(districtSlug)}/${
                          props.slug
                        }`}
                        key={`follow-more-issue-${index}`}
                      >
                        <Issue {...props} />
                      </Link>
                    ))}
                  </FollowMoreTags>
                ) : null}
              </FollowMoreSection>
            )}
          </Body>
        ) : null}
      </ContentBox>
      {showFilter ? (
        <FilterBox $show={showFilter}>
          <FilterModal
            title={title}
            link={`${InternalRoutes.CouncilTopic(districtSlug)}/${slug}`}
            slug={slug}
            placeholder={'篩選議員'}
            initialSelectedOption={tabList}
            fetcher={fetchFilterOptions}
            onClose={() => {
              setShowFilter(false)
            }}
            onConfirmSelection={setTabList}
          />
        </FilterBox>
      ) : null}
    </Box>
  )
}

// sidebar legislator component
const FollowMoreLegislator = styled.div`
  gap: 32px;
  display: flex;
  overflow-x: scroll;
`

export interface SidebarCouncilorProps extends RefAttributes<HTMLDivElement> {
  title: TitleSectionProps['title']
  issueList?: TitleSectionProps['tabs']
  slug: string
  note?: string
  onClose?: () => void
  className?: string
  districtSlug: string
}
export const SidebarCouncilor: React.FC<SidebarCouncilorProps> = ({
  slug,
  title,
  issueList = [],
  note,
  onClose,
  className,
  ref,
  districtSlug,
}: SidebarCouncilorProps) => {
  const topRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tabList, setTabList] = useState(issueList)
  const [selectedTab, setSelectedTab] = useState(0)
  const [showFilter, setShowFilter] = useState(false)
  const showNoIssue = useMemo(() => issueList.length === 0, [issueList])
  const selectedIssue = useMemo(
    () => _.get(tabList, selectedTab),
    [tabList, selectedTab]
  )
  const followMoreTitle: string = useMemo(
    () => `關注 ${_.get(selectedIssue, ['name'], '')} 主題的其他人：`,
    [selectedIssue]
  )
  const { formattedFilterValues } = useContext(CouncilDashboardContext)
  const billState = useCouncilBill(
    formattedFilterValues && selectedIssue
      ? {
          councilorSlug: slug,
          topicSlug: selectedIssue.slug as string,
          councilMeetingId: formattedFilterValues.meetingId,
        }
      : undefined
  )
  const summaryList: SummaryCardProps[] = useMemo(
    () => billState.bills || [],
    [billState.bills]
  )
  const summaryGroupByYear: CardsOfTheYearProps[] = useMemo(
    () => groupSummary(summaryList),
    [summaryList]
  )
  const followMoreState = useMoreCouncilors(
    selectedIssue && selectedIssue.slug
      ? {
          topicSlug: selectedIssue.slug,
          excludeCouncilorSlug: slug,
          city: districtSlug,
        }
      : undefined
  )
  const councilorList: LegislatorProps[] = useMemo(
    () =>
      followMoreState.councilors.map(({ slug, name, avatar, count }) => ({
        slug,
        name,
        avatar,
        count,
      })) || [],
    [followMoreState.councilors]
  )

  const fetchFilterOptions = () => {
    return fetchTopicsOfACouncilor({
      councilorSlug: slug,
      districtSlug: districtSlug as CouncilDistrict,
    })
  }

  useEffect(() => {
    setIsLoading(true)
  }, [slug, selectedTab])

  useEffect(() => {
    if (issueList) {
      setTabList(issueList)
    }
  }, [issueList])

  useEffect(() => {
    if (billState.bills != undefined) {
      setIsLoading(billState.isLoading)
    }
  }, [billState.bills, billState.isLoading])

  useEffect(() => {
    setSelectedTab(0)
  }, [tabList])

  return (
    <Box className={className} ref={ref}>
      <ContentBox $show={!showFilter}>
        <div ref={topRef}>
          <TitleSection
            title={title}
            tabs={tabList}
            showTabAvatar={false}
            link={`${InternalRoutes.Councilor(districtSlug)}/${slug}`}
            onSelectTab={setSelectedTab}
            onClose={onClose}
            onOpenFilterModal={() => setShowFilter(true)}
          />
        </div>
        {showNoIssue ? (
          <Body $topBoxHeight={topRef.current?.offsetHeight || 0}>
            <NoIssueState note={note} />
          </Body>
        ) : isLoading ? (
          <Loader />
        ) : (
          <Body $topBoxHeight={topRef.current?.offsetHeight || 0}>
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
            {followMoreState.isLoading ? null : (
              <FollowMoreSection>
                <FollowMoreTitle text={followMoreTitle} />
                {followMoreState.error ? (
                  <FollowMoreErrorState />
                ) : councilorList.length > 0 ? (
                  <FollowMoreLegislator>
                    {councilorList.map(
                      (props: LegislatorProps, index: number) => (
                        <Link
                          href={`${InternalRoutes.Councilor(districtSlug)}/${
                            props.slug
                          }`}
                          key={`follow-more-councilor-${index}`}
                        >
                          <Legislator {...props} />
                        </Link>
                      )
                    )}
                  </FollowMoreLegislator>
                ) : null}
              </FollowMoreSection>
            )}
          </Body>
        )}
      </ContentBox>
      {showFilter ? (
        <FilterBox $show={showFilter}>
          <FilterModal
            title={title}
            link={`${InternalRoutes.Councilor(districtSlug)}/${slug}`}
            slug={slug}
            placeholder={'篩選議題'}
            initialSelectedOption={tabList}
            fetcher={fetchFilterOptions}
            onClose={() => {
              setShowFilter(false)
            }}
            onConfirmSelection={setTabList}
          />
        </FilterBox>
      ) : null}
    </Box>
  )
}
