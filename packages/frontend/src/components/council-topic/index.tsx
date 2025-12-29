'use client'
import React, { useEffect, useState, type FC } from 'react'
// @twreporter
import { TabletAndBelow } from '@twreporter/react-components/lib/rwd'
import { CITY_LABEL } from '@twreporter/congress-dashboard-shared/lib/constants/city'
// components
import TopicList from '@/components/council-topic/topic-list'
import RelatedTopicInSameCouncil from '@/components/council-topic/related-topic-in-same-council'
import RelatedTopicInElsewhere from '@/components/council-topic/related-topic-in-elsewhere'
import TopicStatistics from '@/components/topic/topic-statistics'
import TopicRelatedArticles from '@/components/topic/topic-related-articles'
import FeedbackBlock from '@/components/layout/feedback-block'
import ContentPageLayout from '../layout/content-page-without-filter-layout'
// styles
import {
  Spacing,
  DesktopList,
  DesktopAside,
  TopicListContainer,
} from '@/components/topic/styles'
//  types
import type { CouncilTopicFromRes } from '@/types/council-topic'
import type { CouncilDistrict } from '@/types/council'
// custom hooks
import useTopicData from '@/components/council-topic/hook/use-topic-data'

type TopicPageProps = {
  topicData: CouncilTopicFromRes
  councilMeeting: {
    city: CouncilDistrict
    term: number
  }
}

const CouncilTopicPage: FC<TopicPageProps> = ({
  topicData,
  councilMeeting,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { topic, councilorCount, councilors, billsByCouncilor } =
    useTopicData(topicData)

  const pageTitle = `#${topic?.title} 的相關議案`

  useEffect(() => {
    setIsLoading(false)
  }, [councilorCount, councilors, billsByCouncilor])

  return (
    <>
      <ContentPageLayout
        title={pageTitle}
        subtitle={`${CITY_LABEL[councilMeeting.city]}議會 | 第${
          councilMeeting.term
        }屆`}
      >
        <DesktopList>
          <TopicListContainer>
            <TopicList
              districtSlug={councilMeeting.city}
              isLoading={isLoading}
              councilors={councilors}
              billsByTopic={billsByCouncilor}
              topic={topic}
            />
          </TopicListContainer>
        </DesktopList>
        <DesktopAside>
          <TopicStatistics
            legislatorCount={councilorCount}
            speechesCount={topic.billCount}
          />
          <TopicRelatedArticles
            relatedArticles={topic.relatedTwreporterArticles}
          />
          <RelatedTopicInSameCouncil
            districtSlug={councilMeeting.city}
            topics={topic.relatedCityCouncilTopic}
          />
          <RelatedTopicInElsewhere
            districtSlug={councilMeeting.city}
            relatedCouncilTopic={topic.relatedCouncilTopic}
            relatedLegilativeTopic={topic.relatedLegislativeTopic}
          />
          <FeedbackBlock eventName="council-topic" />
        </DesktopAside>
        <TabletAndBelow>
          <TopicStatistics
            legislatorCount={councilorCount}
            speechesCount={topic.billCount}
          />
          <Spacing $height={32} />
          <TopicListContainer>
            <TopicList
              districtSlug={councilMeeting.city}
              isLoading={isLoading}
              councilors={councilors}
              billsByTopic={billsByCouncilor}
              topic={topic}
            />
          </TopicListContainer>
          <Spacing $height={8} />
          <TopicRelatedArticles
            relatedArticles={topic?.relatedTwreporterArticles}
          />
          <Spacing $height={8} />
          <RelatedTopicInSameCouncil
            districtSlug={councilMeeting.city}
            topics={topic.relatedCityCouncilTopic}
          />
          <Spacing $height={8} />
          <RelatedTopicInElsewhere
            districtSlug={councilMeeting.city}
            relatedCouncilTopic={topic.relatedCouncilTopic}
            relatedLegilativeTopic={topic.relatedLegislativeTopic}
          />
          <Spacing $height={32} />
          <FeedbackBlock eventName="council-topic" />
        </TabletAndBelow>
      </ContentPageLayout>
    </>
  )
}

export default CouncilTopicPage
