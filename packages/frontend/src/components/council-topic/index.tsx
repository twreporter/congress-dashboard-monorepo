'use client'
import React, { useEffect, useState, useMemo, type FC } from 'react'
// @twreporter
import { TabletAndBelow } from '@twreporter/react-components/lib/rwd'
import { CITY_LABEL } from '@twreporter/congress-dashboard-shared/lib/constants/city'
// components
import TopicList from '@/components/council-topic/topic-list'
import RelatedTopicInSameCouncil from '@/components/council-topic/related-topic-in-same-council'
import RelatedTopicInElsewhere from '@/components/council-topic/related-topic-in-elsewhere'
import Statistics from '@/components/council-topic/statistics'
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
import type { CouncilMeeting } from '@/types/council-meeting'
// utils
import { formatDate } from '@/utils/date-formatters'
// custom hooks
import useTopicData from '@/components/council-topic/hook/use-topic-data'

type TopicPageProps = {
  topicData: CouncilTopicFromRes
  councilMeeting: CouncilMeeting
}

const getDurationString = (start: Date) => {
  return `(${formatDate(start, 'YYYY/MM')}~)`
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

  const councilMeetingText = useMemo(
    () =>
      `${CITY_LABEL[councilMeeting.city]}議會 | 第${
        councilMeeting.term
      }屆 ${getDurationString(councilMeeting.startTime)}`,
    [councilMeeting]
  )

  return (
    <>
      <ContentPageLayout title={pageTitle} subtitle={councilMeetingText}>
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
          <Statistics
            councilorCount={councilorCount}
            billCount={topic.billCount}
          />
          <TopicRelatedArticles
            relatedArticles={topic.relatedTwreporterArticle}
          />
          <RelatedTopicInSameCouncil
            districtSlug={councilMeeting.city}
            topics={topic.relatedCityCouncilTopic}
          />
          <RelatedTopicInElsewhere
            relatedCouncilTopic={topic.relatedCouncilTopic}
            relatedLegislativeTopic={topic.relatedLegislativeTopic}
          />
          <FeedbackBlock eventName="council-topic" />
        </DesktopAside>
        <TabletAndBelow>
          <Statistics
            councilorCount={councilorCount}
            billCount={topic.billCount}
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
            relatedArticles={topic.relatedTwreporterArticle}
          />
          <Spacing $height={8} />
          <RelatedTopicInSameCouncil
            districtSlug={councilMeeting.city}
            topics={topic.relatedCityCouncilTopic}
          />
          <Spacing $height={8} />
          <RelatedTopicInElsewhere
            relatedCouncilTopic={topic.relatedCouncilTopic}
            relatedLegislativeTopic={topic.relatedLegislativeTopic}
          />
          <Spacing $height={32} />
          <FeedbackBlock eventName="council-topic" />
        </TabletAndBelow>
      </ContentPageLayout>
    </>
  )
}

export default CouncilTopicPage
