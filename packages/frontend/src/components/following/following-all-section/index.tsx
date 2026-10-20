'use client'
import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import {
  TabletAndBelow,
  DesktopAndAbove,
} from '@twreporter/react-components/lib/rwd'
import { PillButton } from '@twreporter/react-components/lib/button'
// components
import { FollowingComboCard } from '@/components/following/following-combo-card'
import { FollowingArticleCard } from '@/components/following/following-article-card'
import { FollowingPeopleCard } from '@/components/following/following-people-card'
// constants
import {
  FOLLOWING_TAB,
  getFollowingTabPath,
} from '@/components/following/constants'
import {
  MOCK_COMBO_LIST,
  MOCK_TOPIC_LIST,
  MOCK_PEOPLE_LIST,
  MOCK_SPEECH_LIST,
  MOCK_BILL_LIST,
} from '@/components/following/mock-data'
// styles
import {
  SectionWrapper,
  SectionTitle,
  SectionDescription,
} from '@/components/following/section/styles'

const TopicsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  ${mq.desktopAndAbove`
    gap: 24px;
  `}
`

const TopicCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  ${mq.tabletAndAbove`
    flex-direction: row;
    gap: 24px;
  `}
`

const PeopleSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const FollowingPeopleCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  padding-bottom: 24px;
  gap: 20px;
  ${mq.tabletAndAbove`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  `}
  ${mq.desktopAndAbove`
    padding-top: 24px;
  `}
`

const SpeechSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  ${mq.desktopAndAbove`
    gap: 24px;
  `}
`

const FollowingArticleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const FollowingArticleCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  ${mq.tabletAndAbove`
    display: grid;
    gap: 24px;
  `}
  ${mq.tabletOnly`
    grid-template-columns: repeat(2, 1fr);
  `}
  ${mq.desktopAndAbove`
    grid-template-columns: repeat(3, 1fr);
  `}
`

const MoreButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  gap: 16px;
`

const MoreButton = styled(PillButton)`
  width: 100% !important;
  justify-content: center;
  border-color: ${colorGrayscale.gray600} !important;
  color: ${colorGrayscale.gray600} !important;
  &:hover {
    border-color: ${colorGrayscale.gray800} !important;
    color: ${colorGrayscale.gray800} !important;
  }
  ${mq.tabletAndAbove`
    width: fit-content !important;
  `}
`

const COMBO_LIST = MOCK_COMBO_LIST.slice(0, 2)
const TOPIC_LIST = MOCK_TOPIC_LIST.slice(0, 2)
const PEOPLE_LIST = MOCK_PEOPLE_LIST.slice(0, 4)
const ARTICLE_LIST = [
  { ...MOCK_SPEECH_LIST[0], type: FollowingArticleCard.Type.SPEECH },
  { ...MOCK_BILL_LIST[0], type: FollowingArticleCard.Type.BILL },
  { ...MOCK_SPEECH_LIST[1], type: FollowingArticleCard.Type.SPEECH },
]

export const FollowingAllSection = () => {
  const router = useRouter()

  const goToTab = useCallback(
    (key: string) => {
      router.push(getFollowingTabPath(key))
    },
    [router]
  )

  return (
    <SectionWrapper>
      <TopicsSection>
        <div>
          <SectionTitle text="你關注的議題" />
          <SectionDescription text="從「人物 ✕ 議題」組合與「議題」，查看你關注的議事脈絡" />
        </div>
        <TopicCardContainer>
          <FollowingComboCard
            type={FollowingComboCard.Type.COMBO}
            count={MOCK_COMBO_LIST.length}
            followingInfos={COMBO_LIST}
          />
          <FollowingComboCard
            type={FollowingComboCard.Type.TOPIC}
            count={MOCK_TOPIC_LIST.length}
            followingInfos={TOPIC_LIST}
          />
        </TopicCardContainer>
      </TopicsSection>
      <PeopleSection>
        <div>
          <SectionTitle text="你追蹤的人" />
          <SectionDescription text="查看你關注的立委與議員" />
        </div>
        <FollowingPeopleCardWrapper>
          {PEOPLE_LIST.map((people) => {
            const type =
              people.type === 'councilor'
                ? FollowingPeopleCard.Type.COUNCILOR
                : FollowingPeopleCard.Type.LEGISLATOR
            return (
              <React.Fragment key={people.name}>
                <TabletAndBelow>
                  <FollowingPeopleCard
                    {...people}
                    type={type}
                    size={FollowingPeopleCard.Size.S}
                  />
                </TabletAndBelow>
                <DesktopAndAbove>
                  <FollowingPeopleCard
                    {...people}
                    type={type}
                    size={FollowingPeopleCard.Size.L}
                  />
                </DesktopAndAbove>
              </React.Fragment>
            )
          })}
        </FollowingPeopleCardWrapper>
        <MoreButtonContainer>
          <MoreButton
            text="查看全部"
            type={PillButton.Type.SECONDARY}
            size={PillButton.Size.L}
            style={PillButton.Style.DARK}
            onClick={() => goToTab(FOLLOWING_TAB.PEOPLE)}
          />
        </MoreButtonContainer>
      </PeopleSection>
      <SpeechSection>
        <div>
          <SectionTitle text="你保存的議事資料" />
          <SectionDescription text="查看你關注的發言全文與議案" />
        </div>
        <FollowingArticleSection>
          <FollowingArticleCardWrapper>
            {ARTICLE_LIST.map((article, index) =>
              // only show the third article on desktop and above
              index < 2 ? (
                <FollowingArticleCard key={article.title} {...article} />
              ) : (
                <DesktopAndAbove key={article.title}>
                  <FollowingArticleCard {...article} />
                </DesktopAndAbove>
              )
            )}
          </FollowingArticleCardWrapper>
          <MoreButtonContainer>
            <MoreButton
              text="查看全部發言"
              type={PillButton.Type.SECONDARY}
              size={PillButton.Size.L}
              style={PillButton.Style.DARK}
              onClick={() => goToTab(FOLLOWING_TAB.SPEECH)}
            />
            <MoreButton
              text="查看全部議案"
              type={PillButton.Type.SECONDARY}
              size={PillButton.Size.L}
              style={PillButton.Style.DARK}
              onClick={() => goToTab(FOLLOWING_TAB.BILL)}
            />
          </MoreButtonContainer>
        </FollowingArticleSection>
      </SpeechSection>
    </SectionWrapper>
  )
}
