'use client'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'
import Link from 'next/link'
// twreporter
import { H4, H5 } from '@twreporter/react-components/lib/text/headline'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import { IconButton } from '@twreporter/react-components/lib/button'
import { Arrow, More } from '@twreporter/react-components/lib/icon'
import mq from '@twreporter/core/lib/utils/media-query'
import { DesktopAndAbove } from '@twreporter/react-components/lib/rwd'
//  compoents
import { groupSummary } from '@/components/sidebar'
import CardsOfTheYear, {
  type SummaryCardProps,
  type CardsOfTheYearProps,
} from '@/components/sidebar/card'
import {
  Legislator,
  type LegislatorProps,
} from '@/components/sidebar/followMore'
import Tab, { type TabProps } from '@/components/sidebar/tab'
// utils
import { notoSerif } from '@/utils/font'
// lodash
import get from 'lodash/get'
const _ = {
  get,
}

import { fetchTopLegislatorsBySpeechCount } from '@/fetchers/legislator'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const Title = styled(H4)`
  color: ${colorGrayscale.gray900};
  padding: 24px 24px 12px 24px;
  font-family: ${notoSerif.style.fontFamily} !important;
  ${mq.tabletOnly`
    padding: 32px 32px 12px 32px;
  `}
`
const Body = styled.div`
  display: flex;
  padding: 24px 24px 40px 24px;
  flex-direction: column;
  gap: 40px;
  ${mq.tabletOnly`
    padding: 24px 32px 40px 32px;
  `}
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
const FollowMoreLegislator = styled.div`
  gap: 32px;
  display: flex;
  overflow-x: scroll;
  a {
    text-decoration: none;
  }
`

const TabGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid ${colorGrayscale.gray300};
  padding-right: 24px;
  ${mq.tabletOnly`
    padding-right: 32px;
  `}
`
const TabItem = styled.div`
  padding-left: 24px;
`
const Button = styled(IconButton)`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  &:before {
    content: '';
    height: 28px;
    border-right: 1px solid ${colorGrayscale.gray300};
    position: relative;
    left: -10px;
  }
`
const ScrollableTab = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  scrollbar-width: none;
  width: 300px;
  flex: 1;
  ${TabItem} {
    ${mq.desktopAndAbove`
      &:first-child {
        padding-left: 12px;
      }
    `}
    ${mq.tabletOnly`
      &:first-child {
        padding-left: 32px;
      }
    `}
  }
`

const ArrowIcon = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &.left-arrow {
    margin-left: 16px;
  }
  &.right-arrow {
    margin-left: 12px;
    margin-right: 16px;
  }
`

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
  const releaseBranch = 'master'

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

  const selectTab = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedTab(index)

    const tabElement = e.currentTarget as HTMLElement
    if (tabElement) {
      tabElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'center',
      })
    }
  }

  const openFilter = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    alert(`open filter modal`)
  }

  return (
    <Container>
      <Title text="發言摘要" />
      <TabGroup>
        <DesktopAndAbove>
          <ArrowIcon
            className="left-arrow"
            onClick={(e: React.MouseEvent<HTMLElement>) =>
              selectTab(e, selectedTab - 1 > 0 ? selectedTab - 1 : 0)
            }
          >
            <Arrow direction={Arrow.Direction.LEFT} />
          </ArrowIcon>
        </DesktopAndAbove>
        <ScrollableTab>
          {tabs.map((tabProps: TabProps, index: number) => (
            <TabItem
              key={`sidebar-tab-${index}`}
              onClick={(e: React.MouseEvent<HTMLElement>) =>
                selectTab(e, index)
              }
            >
              <Tab {...tabProps} selected={index === selectedTab} />
            </TabItem>
          ))}
        </ScrollableTab>
        <DesktopAndAbove>
          <ArrowIcon
            className="right-arrow"
            onClick={(e: React.MouseEvent<HTMLElement>) =>
              selectTab(
                e,
                selectedTab + 1 < tabs.length - 1
                  ? selectedTab + 1
                  : tabs.length - 1
              )
            }
          >
            <Arrow direction={Arrow.Direction.RIGHT} />
          </ArrowIcon>
        </DesktopAndAbove>
        <Button
          iconComponent={<More releaseBranch={releaseBranch} />}
          theme={IconButton.THEME.normal}
          type={IconButton.Type.PRIMARY}
          onClick={openFilter}
        />
      </TabGroup>
      <Body>
        <SummarySection>
          {summaryGroupByYear.map(
            (props: CardsOfTheYearProps, index: number) => (
              <CardsOfTheYear {...props} key={`summary-of-the-year-${index}`} />
            )
          )}
        </SummarySection>
        <FollowMoreSection>
          <FollowMoreTitle text={followMoreTitle} />
          {legislatorList.length > 0 ? (
            <FollowMoreLegislator>
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
            </FollowMoreLegislator>
          ) : null}
        </FollowMoreSection>
      </Body>
    </Container>
  )
}

export default LegislatorList
