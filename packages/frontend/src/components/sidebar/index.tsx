'use client'

import React, { useEffect, useMemo, useState, RefAttributes } from 'react'
import styled, { keyframes } from 'styled-components'
// mock config
import {
  mockGetSummary,
  mockGetIssue,
  mockGetLegislator,
} from '@/components/sidebar/config'
// fetcher
import fetchLegislatorsOfATopic from '@/fetchers/legislator'
import fetchTopicOfALegislator from '@/fetchers/topic'
// constants
import { InternalRoutes } from '@/constants/navigation-link'
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
// @twreporter
import { H5 } from '@twreporter/react-components/lib/text/headline'
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import { Loading } from '@twreporter/react-components/lib/icon'
import mq from '@twreporter/core/lib/utils/media-query'
// lodash
import { get, groupBy, forEach } from 'lodash'
const _ = {
  get,
  groupBy,
  forEach,
}

// global var
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH

// loader component
const spin = keyframes`
  0% {
      transform: rotate(0deg);
  }
  100% {
      transform: rotate(360deg);
  }
`
const LoadingBox = styled.div`
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  display: flex;
  align-items: center;

  svg {
    width: 48px;
    height: 48px;
    animation: ${spin} 1s linear infinite;
  }
`
const Loader: React.FC = () => (
  <LoadingBox>
    <Loading releaseBranch={releaseBranch} />
  </LoadingBox>
)

// sidebar issue component
const Box = styled.div`
  width: 520px;
  height: 100vh;
  background-color: ${colorGrayscale.white};
  overflow-x: hidden;
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
`
const Body = styled.div`
  display: flex;
  padding: 24px 24px 40px 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
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
    summary.date.getFullYear()
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
  count: TitleSectionProps['count']
  legislatorList?: TitleSectionProps['tabs']
  slug: string
  onClose?: () => void
  className?: string
}
export const SidebarIssue: React.FC<SidebarIssueProps> = ({
  slug,
  title,
  count,
  legislatorList = [],
  onClose,
  className,
  ref,
}: SidebarIssueProps) => {
  const [tabList, setTabList] = useState(legislatorList)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState(0)
  const [showFilter, setShowFilter] = useState(false)
  const selectedLegislator = useMemo(
    () => _.get(tabList, selectedTab),
    [tabList, selectedTab]
  )
  const summaryList: SummaryCardProps[] = useMemo(
    () => mockGetSummary(selectedLegislator.slug),
    [selectedLegislator]
  )
  const issueList: IssueProps[] = useMemo(
    () => mockGetIssue(selectedLegislator.slug),
    [selectedLegislator]
  )
  const followMoreTitle: string = useMemo(
    () => `${_.get(selectedLegislator, ['name'], '')} 近期關注的五大議題：`,
    [selectedLegislator]
  )
  const summaryGroupByYear: CardsOfTheYearProps[] = useMemo(
    () => groupSummary(summaryList),
    [summaryList]
  )

  useEffect(() => {
    setIsLoading(true)

    if (window) {
      window.setTimeout(() => setIsLoading(false), 2000)
    }
  }, [selectedTab])
  useEffect(() => {
    setSelectedTab(0)
  }, [tabList])

  return (
    <Box className={className} ref={ref}>
      <ContentBox $show={!showFilter}>
        <TitleSection
          title={title}
          count={count}
          tabs={tabList}
          link={`${InternalRoutes.Legislator}/${slug}`}
          onSelectTab={setSelectedTab}
          onOpenFilterModal={() => setShowFilter(true)}
          onClose={onClose}
        />
        {isLoading ? (
          <Loader />
        ) : (
          <Body>
            <SummarySection>
              {summaryGroupByYear.map(
                (props: CardsOfTheYearProps, index: number) => (
                  <CardsOfTheYear
                    {...props}
                    key={`summary-of-the-year-${index}`}
                  />
                )
              )}
            </SummarySection>
            <FollowMoreSection>
              <FollowMoreTitle text={followMoreTitle} />
              {issueList.length > 0 ? (
                <FollowMoreTags>
                  {issueList.map((props: IssueProps, index: number) => (
                    <Issue {...props} key={`follow-more-issue-${index}`} />
                  ))}
                </FollowMoreTags>
              ) : null}
            </FollowMoreSection>
          </Body>
        )}
      </ContentBox>
      {showFilter ? (
        <FilterBox $show={showFilter}>
          <FilterModal
            title={`${title} 的相關發言篩選`}
            slug={slug}
            initialSelectedOption={tabList}
            fetcher={fetchLegislatorsOfATopic}
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

export interface SidebarLegislatorProps extends RefAttributes<HTMLDivElement> {
  title: TitleSectionProps['title']
  subtitle?: TitleSectionProps['subtitle']
  issueList?: TitleSectionProps['tabs']
  slug: string
  onClose?: () => void
  className?: string
}
export const SidebarLegislator: React.FC<SidebarLegislatorProps> = ({
  slug,
  title,
  subtitle,
  issueList = [],
  onClose,
  className,
  ref,
}: SidebarLegislatorProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [tabList, setTabList] = useState(issueList)
  const [selectedTab, setSelectedTab] = useState(0)
  const [showFilter, setShowFilter] = useState(false)
  const selectedIssue = useMemo(
    () => _.get(tabList, selectedTab),
    [tabList, selectedTab]
  )
  const summaryList: SummaryCardProps[] = useMemo(
    () => mockGetSummary(selectedIssue.slug),
    [selectedIssue]
  )
  const legislatorList: LegislatorProps[] = useMemo(
    () => mockGetLegislator(selectedIssue.slug),
    [selectedIssue]
  )
  const followMoreTitle: string = useMemo(
    () => `關注 ${_.get(selectedIssue, ['name'], '')} 主題的其他人：`,
    [selectedIssue]
  )
  const summaryGroupByYear: CardsOfTheYearProps[] = useMemo(
    () => groupSummary(summaryList),
    [summaryList]
  )

  useEffect(() => {
    setIsLoading(true)

    if (window) {
      window.setTimeout(() => setIsLoading(false), 2000)
    }
  }, [selectedTab])

  useEffect(() => {
    setSelectedTab(0)
  }, [tabList])

  return (
    <Box className={className} ref={ref}>
      <ContentBox $show={!showFilter}>
        <TitleSection
          title={title}
          subtitle={subtitle}
          tabs={tabList}
          link={`${InternalRoutes.Topic}/${slug}`}
          onSelectTab={setSelectedTab}
          onClose={onClose}
          onOpenFilterModal={() => setShowFilter(true)}
        />
        {isLoading ? (
          <Loader />
        ) : (
          <Body>
            <SummarySection>
              {summaryGroupByYear.map(
                (props: CardsOfTheYearProps, index: number) => (
                  <CardsOfTheYear
                    {...props}
                    key={`summary-of-the-year-${index}`}
                  />
                )
              )}
            </SummarySection>
            <FollowMoreSection>
              <FollowMoreTitle text={followMoreTitle} />
              {legislatorList.length > 0 ? (
                <FollowMoreLegislator>
                  {legislatorList.map(
                    (props: LegislatorProps, index: number) => (
                      <Legislator
                        {...props}
                        key={`follow-more-legislator-${index}`}
                      />
                    )
                  )}
                </FollowMoreLegislator>
              ) : null}
            </FollowMoreSection>
          </Body>
        )}
      </ContentBox>
      {showFilter ? (
        <FilterBox $show={showFilter}>
          <FilterModal
            title={`${title} 的相關發言篩選`}
            subtitle={subtitle}
            slug={slug}
            initialSelectedOption={tabList}
            fetcher={fetchTopicOfALegislator}
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
