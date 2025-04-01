'use client'
import React, {useState} from 'react'
import Link from 'next/link'
// twreporter
import {TabletAndBelow, DesktopAndAbove} from '@twreporter/react-components/lib/rwd'
// components
import FilterButton from '@/components/button/filter-button'
// import IssueTag from '@/components/button/issue-tag'
import TopicList from '@/components/topic/topic-list'
import { Issue } from '@/components/sidebar/followMore'
// styles
import { TopicWrapper,TopicContainer, LeadingContainer, TopicTitle, FilterBar, P1Gray700, Spacing, ContentBlock, DesktopAside, TopicListContainer, StatisticsBlock, StatisticsDiv,
  P1Gray800, StatisticsNumber, RelatedArticleBlock, H4Title, OthersWatchingBlock, OthersWatchingTags, Feedback
 } from '@/components/topic/styles'


const othersWatchingTags = [
  {
    title: '環境1',
    slug: 'slug-1'
  },
  {
    title: '環境2',
    slug: 'slug-2'
  },
  {
    title: '環境3',
    slug: 'slug-3'
  },
  {
    title: '環境4',
    slug: 'slug-4'
  },
]

type TopicPageProps = {
  slug: string
}
const Topic: React.FC<TopicPageProps> = ({slug}) => {
  const [currentMeetingTerm, setCurrentMeetingTerm] = useState(11)
  return (
    <TopicWrapper>
      <TopicContainer>
        <LeadingContainer>
          <TopicTitle text={`#${slug} 的相關發言摘要`} />
          <FilterBar>
            <P1Gray700 text={`第${currentMeetingTerm}屆｜全部會期`} />
            <FilterButton filterCount={10} />
          </FilterBar>
        </LeadingContainer>
        <Spacing $height={32} />
        <ContentBlock>
          <DesktopAndAbove>
            <TopicListContainer>
              <TopicList />
            </TopicListContainer>
          </DesktopAndAbove>
          <DesktopAside>
            <StatisticsBlock>
              <StatisticsDiv>
                <P1Gray800 text="發言立委人數" />
                <StatisticsNumber>99</StatisticsNumber>
              </StatisticsDiv>
              <StatisticsDiv>
                <P1Gray800 text="發言總數" />
                <StatisticsNumber>99</StatisticsNumber>
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
                    href={`/topics/${topic.slug}`}
                    key={`issue-tag-${idx}-${topic.slug}`}
                  >
                    <Issue name={topic.title} />
                  </Link>
                ))}
              </OthersWatchingTags>
            </OthersWatchingBlock>
            <Feedback>
              <span>發現什麼問題嗎？透過
                <Link href={'/feedback'} target='_blank'>
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
                <StatisticsNumber>99</StatisticsNumber>
              </StatisticsDiv>
              <StatisticsDiv>
                <P1Gray800 text="發言總數" />
                <StatisticsNumber>99</StatisticsNumber>
              </StatisticsDiv>
            </StatisticsBlock>
            <Spacing $height={32} />
            <TopicListContainer>
              <TopicList />
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
                    href={`/topics/${topic.slug}`}
                    key={`issue-tag-${idx}-${topic.slug}`}
                  >
                    <Issue name={topic.title} />
                  </Link>
                ))}
              </OthersWatchingTags>
            </OthersWatchingBlock>
            <Spacing $height={32} />
            <Feedback>
              <span>發現什麼問題嗎？透過
                <Link href={'/feedback'} target='_blank'>
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