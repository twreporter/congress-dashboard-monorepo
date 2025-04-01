'use client'
import React, { useMemo, useRef, useState, useEffect } from 'react'
import Link from 'next/link'
// twreporter
import {
  TabletAndAbove,
  TabletAndBelow,
  DesktopAndAbove,
} from '@twreporter/react-components/lib/rwd'
// components
import FilterButton from '@/components/button/filter-button'
import TopicList from '@/components/topic/topic-list'
import { Issue } from '@/components/sidebar/followMore'
// context
import { useScrollContext } from '@/contexts/scroll-context'
// styles
import {
  TopicWrapper,
  TopicContainer,
  LeadingContainer,
  TopicTitle,
  FilterBar,
  P1Gray700,
  Spacing,
  ContentBlock,
  DesktopAside,
  TopicListContainer,
  StatisticsBlock,
  StatisticsDiv,
  P1Gray800,
  StatisticsNumber,
  RelatedArticleBlock,
  H4Title,
  OthersWatchingBlock,
  OthersWatchingTags,
  Feedback,
  FunctionBarWrapper,
  FunctionBar,
  FunctionBarTitle,
} from '@/components/topic/styles'
//  fetcher
import { type TopicData } from '@/fetchers/topic'
// lodash
import groupBy from 'lodash/groupBy'
const _ = {
  groupBy,
}

const othersWatchingTags = [
  {
    title: '環境1',
    slug: 'slug-1',
  },
  {
    title: '環境2',
    slug: 'slug-2',
  },
  {
    title: '環境3',
    slug: 'slug-3',
  },
  {
    title: '環境4',
    slug: 'slug-4',
  },
]

type TopicPageProps = {
  topic: TopicData
  currentMeetingTerm: number
  currentMeetingSession: number[]
}

const Topic: React.FC<TopicPageProps> = ({
  topic,
  currentMeetingTerm,
  currentMeetingSession,
}) => {
  const { setTabElement, isHeaderHidden } = useScrollContext()
  const leadingRef = useRef<HTMLDivElement>(null)
  const [isControllBarHidden, setIsControllBarHidden] = useState(true)

  useEffect(() => {
    if (leadingRef.current) {
      setTabElement(leadingRef.current)
    }
  }, [setTabElement, leadingRef])

  useEffect(() => {
    if (!leadingRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsControllBarHidden(entry.isIntersecting)
      },
      {
        threshold: 0.5,
      }
    )
    observer.observe(leadingRef.current)
    return () => {
      observer.disconnect()
    }
  }, [leadingRef])

  const { legislatorCount, legislatorsData, speechesByLegislator } =
    useMemo(() => {
      if (!topic?.speeches || !topic.speeches.length) {
        return {
          legislatorCount: 0,
          legislatorsData: [],
          speechesByLegislator: {},
        }
      }
      const speechesByLegislator = _.groupBy(
        topic.speeches,
        (speech) => speech.legislativeYuanMember.legislator.slug
      )
      const legislatorCount = Object.keys(speechesByLegislator).length
      const legislatorsData = Object.entries(speechesByLegislator).map(
        ([slug, speeches]) => ({
          name: speeches[0].legislativeYuanMember.legislator.name,
          slug,
          imageLink:
            speeches[0].legislativeYuanMember.legislator.image?.imageFile
              ?.url || speeches[0].legislativeYuanMember.legislator.imageLink,
          count: speeches.length,
        })
      )
      return { legislatorCount, legislatorsData, speechesByLegislator }
    }, [topic?.speeches])

  if (!topic) {
    return <div>No topic data found</div>
  }

  return (
    <TopicWrapper>
      <FunctionBarWrapper
        $isHeaderHidden={isHeaderHidden}
        $isHidden={isControllBarHidden}
      >
        <FunctionBar>
          <FunctionBarTitle text={`#${topic?.title} 的相關發言摘要`} />
          <FilterBar>
            <TabletAndAbove>
              <P1Gray700
                text={`第${currentMeetingTerm}屆｜${
                  currentMeetingSession.length ? '全部' : '部分'
                }會期`}
              />
            </TabletAndAbove>
            <FilterButton filterCount={10} />
          </FilterBar>
        </FunctionBar>
      </FunctionBarWrapper>
      <TopicContainer>
        <LeadingContainer ref={leadingRef}>
          <TopicTitle text={`#${topic?.title} 的相關發言摘要`} />
          <FilterBar>
            <P1Gray700
              text={`第${currentMeetingTerm}屆｜${
                currentMeetingSession.length ? '全部' : '部分'
              }會期`}
            />
            <FilterButton filterCount={10} />
          </FilterBar>
        </LeadingContainer>
        <Spacing $height={32} />
        <ContentBlock>
          <DesktopAndAbove>
            <TopicListContainer>
              <TopicList
                legislatorsData={legislatorsData}
                speechesByLegislator={speechesByLegislator}
                currentMeetingTerm={currentMeetingTerm}
                currentMeetingSession={currentMeetingSession}
              />
            </TopicListContainer>
          </DesktopAndAbove>
          <DesktopAside>
            <StatisticsBlock>
              <StatisticsDiv>
                <P1Gray800 text="發言立委人數" />
                <StatisticsNumber>{legislatorCount}</StatisticsNumber>
              </StatisticsDiv>
              <StatisticsDiv>
                <P1Gray800 text="發言總數" />
                <StatisticsNumber>{topic?.speechesCount}</StatisticsNumber>
              </StatisticsDiv>
            </StatisticsBlock>
            <RelatedArticleBlock>
              <H4Title text="相關文章" />
            </RelatedArticleBlock>
            <OthersWatchingBlock>
              <H4Title text="其他人也在看" />
              <OthersWatchingTags>
                {othersWatchingTags.map((topic, idx) => (
                  <Link
                    href={`/topics/${
                      topic.slug
                    }?meetingTerm=${currentMeetingTerm}&sessionTerm=${JSON.stringify(
                      currentMeetingSession
                    )}`}
                    key={`issue-tag-${idx}-${topic.slug}`}
                  >
                    <Issue name={topic.title} />
                  </Link>
                ))}
              </OthersWatchingTags>
            </OthersWatchingBlock>
            <Feedback>
              <span>
                發現什麼問題嗎？透過
                <Link href={'/feedback'} target="_blank">
                  問題回報
                </Link>
                告訴我們，一起讓這裡變得更好！
              </span>
            </Feedback>
          </DesktopAside>
          <TabletAndBelow>
            <StatisticsBlock>
              <StatisticsDiv>
                <P1Gray800 text="發言立委人數" />
                <StatisticsNumber>{legislatorCount}</StatisticsNumber>
              </StatisticsDiv>
              <StatisticsDiv>
                <P1Gray800 text="發言總數" />
                <StatisticsNumber>{topic?.speechesCount}</StatisticsNumber>
              </StatisticsDiv>
            </StatisticsBlock>
            <Spacing $height={32} />
            <TopicListContainer>
              <TopicList
                legislatorsData={legislatorsData}
                speechesByLegislator={speechesByLegislator}
                currentMeetingTerm={currentMeetingTerm}
                currentMeetingSession={currentMeetingSession}
              />
            </TopicListContainer>
            <Spacing $height={8} />
            <RelatedArticleBlock>
              <H4Title text="相關文章" />
            </RelatedArticleBlock>
            <Spacing $height={8} />
            <OthersWatchingBlock>
              <H4Title text="其他人也在看" />
              <OthersWatchingTags>
                {othersWatchingTags.map((topic, idx) => (
                  <Link
                    href={`/topics/${
                      topic.slug
                    }?meetingTerm=${currentMeetingTerm}&sessionTerm=${JSON.stringify(
                      currentMeetingSession
                    )}`}
                    key={`issue-tag-${idx}-${topic.slug}`}
                  >
                    <Issue name={topic.title} />
                  </Link>
                ))}
              </OthersWatchingTags>
            </OthersWatchingBlock>
            <Spacing $height={32} />
            <Feedback>
              <span>
                發現什麼問題嗎？透過
                <Link href={'/feedback'} target="_blank">
                  問題回報
                </Link>
                告訴我們，一起讓這裡變得更好！
              </span>
            </Feedback>
          </TabletAndBelow>
        </ContentBlock>
      </TopicContainer>
    </TopicWrapper>
  )
}

export default Topic
