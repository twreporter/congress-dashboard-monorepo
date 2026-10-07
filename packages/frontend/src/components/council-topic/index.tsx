'use client'
import React, { useMemo, type FC } from 'react'
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
import BackToTopButton from '@/components/councilor/back-to-top-button'
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
import type { CouncilorWithWorkCounts } from '@/types/councilor'
// custom hooks
import useTopicData from '@/components/council-topic/hook/use-topic-data'

type TopicPageProps = {
  topicData: CouncilTopicFromRes
  councilorsData: CouncilorWithWorkCounts[]
  councilMeeting: CouncilMeeting
}

const CouncilTopicPage: FC<TopicPageProps> = ({
  topicData,
  councilorsData,
  councilMeeting,
}) => {
  const { topic, speechCouncilorCount, billCouncilorCount, councilors } =
    useTopicData(topicData, councilorsData)

  const pageTitle = `#${topic.title} 的相關發言與議案`

  const councilMeetingText = useMemo(
    () => `${CITY_LABEL[councilMeeting.city]}議會 | 第${councilMeeting.term}屆`,
    [councilMeeting]
  )

  return (
    <>
      <ContentPageLayout title={pageTitle} subtitle={councilMeetingText}>
        <DesktopList>
          <TopicListContainer>
            <TopicList
              districtSlug={councilMeeting.city}
              councilMeetingId={Number(councilMeeting.id)}
              councilors={councilors}
              topic={topic}
            />
          </TopicListContainer>
        </DesktopList>
        <DesktopAside>
          <Statistics
            speechCouncilorCount={speechCouncilorCount}
            speechCount={topic.speechCount}
            billCouncilorCount={billCouncilorCount}
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
            speechCouncilorCount={speechCouncilorCount}
            speechCount={topic.speechCount}
            billCouncilorCount={billCouncilorCount}
            billCount={topic.billCount}
          />
          <Spacing $height={32} />
          <TopicListContainer>
            <TopicList
              districtSlug={councilMeeting.city}
              councilMeetingId={Number(councilMeeting.id)}
              councilors={councilors}
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
      <BackToTopButton />
    </>
  )
}

export default CouncilTopicPage
