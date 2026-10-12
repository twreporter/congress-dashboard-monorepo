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
            count={5}
            followingInfos={[
              {
                title: '苗博雅 ✕ 社會住宅政策',
                description: '台北市議會｜第 14 屆｜全部會期',
                billCount: 10,
                speechCount: 5,
                latestDataDate: '2024/06/01',
              },
            ]}
          />
          <FollowingComboCard
            type={FollowingComboCard.Type.TOPIC}
            count={5}
            followingInfos={[
              {
                title: '社會住宅政策',
                description: '立法院｜第 11 屆｜第 1-5 會期',
                billCount: 10,
                speechCount: 5,
                latestDataDate: '2024-06-01',
              },
              {
                title: 'Title 2',
                description: 'Description 2',
                billCount: 8,
                speechCount: 3,
                latestDataDate: '2024-06-01',
              },
            ]}
          />
        </TopicCardContainer>
      </TopicsSection>
      <PeopleSection>
        <div>
          <SectionTitle text="你追蹤的人" />
          <SectionDescription text="查看你關注的立委與議員" />
        </div>
        <FollowingPeopleCardWrapper>
          <TabletAndBelow>
            <FollowingPeopleCard
              size={FollowingPeopleCard.Size.S}
              type={FollowingPeopleCard.Type.LEGISLATOR}
              avatar="https://lawmaker.twreporter.org/images/110007.jpg"
              party="https://lawmaker.twreporter.org/images/JISgLBhivHWdd0lB9cWimg.png"
              name="Name"
              description="第 11 屆｜台北市第 1 選舉區"
              count={5}
              latestDate="2024/06/01"
            />
          </TabletAndBelow>
          <TabletAndBelow>
            <FollowingPeopleCard
              size={FollowingPeopleCard.Size.S}
              type={FollowingPeopleCard.Type.LEGISLATOR}
              avatar="https://lawmaker.twreporter.org/images/110007.jpg"
              party="https://lawmaker.twreporter.org/images/JISgLBhivHWdd0lB9cWimg.png"
              name="Name"
              description="第 11 屆｜台北市第 1 選舉區"
              count={5}
              latestDate="2024/06/01"
            />
          </TabletAndBelow>
          <TabletAndBelow>
            <FollowingPeopleCard
              size={FollowingPeopleCard.Size.S}
              type={FollowingPeopleCard.Type.LEGISLATOR}
              avatar="https://lawmaker.twreporter.org/images/110007.jpg"
              party="https://lawmaker.twreporter.org/images/JISgLBhivHWdd0lB9cWimg.png"
              name="Name"
              description="第 11 屆｜台北市第 1 選舉區"
              count={5}
              latestDate="2024/06/01"
            />
          </TabletAndBelow>
          <DesktopAndAbove>
            <FollowingPeopleCard
              size={FollowingPeopleCard.Size.L}
              type={FollowingPeopleCard.Type.LEGISLATOR}
              avatar="https://lawmaker.twreporter.org/images/110007.jpg"
              party="https://lawmaker.twreporter.org/images/JISgLBhivHWdd0lB9cWimg.png"
              name="Name"
              description="第 11 屆｜台北市第 1 選舉區"
              count={5}
              latestDate="2024/06/01"
            />
          </DesktopAndAbove>
          <DesktopAndAbove>
            <FollowingPeopleCard
              size={FollowingPeopleCard.Size.L}
              type={FollowingPeopleCard.Type.LEGISLATOR}
              avatar="https://lawmaker.twreporter.org/images/110007.jpg"
              party="https://lawmaker.twreporter.org/images/JISgLBhivHWdd0lB9cWimg.png"
              name="Name"
              description="第 11 屆｜台北市第 1 選舉區"
              count={5}
              latestDate="2024/06/01"
            />
          </DesktopAndAbove>
          <DesktopAndAbove>
            <FollowingPeopleCard
              size={FollowingPeopleCard.Size.L}
              type={FollowingPeopleCard.Type.LEGISLATOR}
              avatar="https://lawmaker.twreporter.org/images/110007.jpg"
              party="https://lawmaker.twreporter.org/images/JISgLBhivHWdd0lB9cWimg.png"
              name="Name"
              description="第 11 屆｜台北市第 1 選舉區"
              count={5}
              latestDate="2024/06/01"
            />
          </DesktopAndAbove>
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
            <FollowingArticleCard
              type={FollowingArticleCard.Type.SPEECH}
              place="Place 1"
              title="Title 1"
              summary="賴士葆詢問陳淑姿，針對立法院三讀通過的718億元民生總預算是否已准予動支，並強調該預算包含TPASS計畫、包含TPASS計畫包含TPASS計畫"
              attendee={['Attendee 1']}
              date="2024/06/01"
            />
            <FollowingArticleCard
              type={FollowingArticleCard.Type.BILL}
              place="Place 2"
              title="Title 2"
              summary="Summary 2"
              attendee={['Attendee 2', 'Attendee 3', 'Attendee 4']}
              date="2024/06/01"
            />
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
