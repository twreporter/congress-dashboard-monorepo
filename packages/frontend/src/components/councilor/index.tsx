'use client'
import React, { useState, useEffect } from 'react'
// @twreporter
import { TabletAndBelow } from '@twreporter/react-components/lib/rwd'
import { CITY_LABEL } from '@twreporter/congress-dashboard-shared/lib/constants/city'
// components
import CouncilorInfo from '@/components/councilor/councilor-info'
import CouncilorStatistics from '@/components/councilor/statistic'
import TopicList from '@/components/councilor/topic-list'
import RelatedLinkBlock from '@/components/layout/related-link-block'
import FeedbackBlock from '@/components/layout/feedback-block'
import ContentPageLayout from '@/components/layout/content-page-without-filter-layout'
// styles
import {
  ContentBlock,
  DesktopContainer,
  DesktopAsideLeft,
  DesktopAsideRight,
  ListContainer,
} from '@/components/legislator/styles'
// type
import type { CouncilorMemberData } from '@/types/councilor'
import type { CouncilTopicOfBillData } from '@/types/council-topic'
import type { CouncilDistrict } from '@/types/council'
// hooks
import useCouncilorData from '@/components/councilor/hook/use-councilor-data'

type CouncilorProps = {
  slug: string
  districtSlug: CouncilDistrict
  councilorData: CouncilorMemberData
  topicsData: CouncilTopicOfBillData[]
}
const Councilor: React.FC<CouncilorProps> = ({
  slug,
  districtSlug,
  councilorData,
  topicsData,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { councilor, topics, billsByTopic } = useCouncilorData(
    slug,
    councilorData,
    topicsData
  )

  const pageTitle = `${councilor.name} 的相關議案`

  useEffect(() => {
    setIsLoading(false)
  }, [councilor, topics, billsByTopic])

  return (
    <>
      <ContentPageLayout
        title={pageTitle}
        subtitle={`${CITY_LABEL[councilor.councilMeeting.city]}議會 | 第${
          councilor.councilMeeting.term
        }屆`}
      >
        <DesktopContainer>
          <DesktopAsideLeft>
            <CouncilorInfo councilor={councilor} />
            <RelatedLinkBlock relatedLink={councilor.relatedLink} />
            <FeedbackBlock eventName="councilor" />
          </DesktopAsideLeft>
          <DesktopAsideRight>
            <CouncilorStatistics
              administrativeDistrict={councilor.administrativeDistrict}
              proposalSuccessCount={councilor.proposalSuccessCount}
              meetingTermCount={councilor.meetingTermCount}
              meetingTermCountInfo={councilor.meetingTermCountInfo}
            />
            <ListContainer>
              <TopicList
                isLoading={isLoading}
                councilor={councilor}
                topics={topics}
                billsByTopic={billsByTopic}
                districtSlug={districtSlug}
              />
            </ListContainer>
          </DesktopAsideRight>
        </DesktopContainer>
        <TabletAndBelow>
          <ContentBlock>
            <CouncilorInfo councilor={councilor} />
            <CouncilorStatistics
              administrativeDistrict={councilor.administrativeDistrict}
              proposalSuccessCount={councilor.proposalSuccessCount}
              meetingTermCount={councilor.meetingTermCount}
              meetingTermCountInfo={councilor.meetingTermCountInfo}
            />
            <RelatedLinkBlock relatedLink={councilor.relatedLink} />
            <ListContainer>
              <TopicList
                isLoading={isLoading}
                councilor={councilor}
                topics={topics}
                billsByTopic={billsByTopic}
                districtSlug={districtSlug}
              />
            </ListContainer>
            <FeedbackBlock eventName="councilor" />
          </ContentBlock>
        </TabletAndBelow>
      </ContentPageLayout>
    </>
  )
}

export default Councilor
