'use client'

import React, { useEffect, useMemo, useState, RefAttributes } from 'react'
import styled, { keyframes } from 'styled-components'
// mock config
import {
  mockGetSummary,
  mockGetIssue,
  mockGetLegislator,
} from '@/components/sidebar/config'
// components
import TitleSection, {
  TitleSectionProps,
} from '@/components/sidebar/titleSection'
import CardsOfTheYear, {
  SummaryCardProps,
  CardsOfTheYearProps,
} from '@/components/sidebar/card'
import {
  Issue,
  IssueProps,
  Legislator,
  LegislatorProps,
} from '@/components/sidebar/followMore'
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
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState(0)
  const selectedLegislator = useMemo(
    () => _.get(legislatorList, selectedTab),
    [legislatorList, selectedTab]
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

  return (
    <Box className={className} ref={ref}>
      <TitleSection
        title={title}
        count={count}
        tabs={legislatorList}
        link={`/legislator/${slug}`}
        onSelectTab={setSelectedTab}
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
  const [selectedTab, setSelectedTab] = useState(0)
  const selectedIssue = useMemo(
    () => _.get(issueList, selectedTab),
    [issueList, selectedTab]
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

  return (
    <Box className={className} ref={ref}>
      <TitleSection
        title={title}
        subtitle={subtitle}
        tabs={issueList}
        link={`/issue/${slug}`}
        onSelectTab={setSelectedTab}
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
            {legislatorList.length > 0 ? (
              <FollowMoreLegislator>
                {legislatorList.map((props: LegislatorProps, index: number) => (
                  <Legislator
                    {...props}
                    key={`follow-more-legislator-${index}`}
                  />
                ))}
              </FollowMoreLegislator>
            ) : null}
          </FollowMoreSection>
        </Body>
      )}
    </Box>
  )
}
