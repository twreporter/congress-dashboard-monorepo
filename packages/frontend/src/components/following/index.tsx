'use client'
import React, { useState } from 'react'
import styled from 'styled-components'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
import { H1, H4 } from '@twreporter/react-components/lib/text/headline'
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import {
  TabletAndBelow,
  DesktopAndAbove,
} from '@twreporter/react-components/lib/rwd'
// components
import Tab from '@/components/dashboard/function-bar/tab'
import { FollowingComboCard } from '@/components/following/following-combo-card'
import { FollowingArticleCard } from '@/components/following/following-article-card'
import { FollowingPeopleCard } from '@/components/following/following-people-card'

const FollowingContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 32px 24px 80px 24px;
  ${mq.tabletOnly`
    padding: 32px 32px 80px 32px;
  `}
  ${mq.desktopOnly`
    padding: 48px 48px 120px 48px;
  `}
  ${mq.hdOnly`
    width: 928px;
    margin: auto;
    padding: 48px 0 120px 0;
  `}
`

const PageTitle = styled(H1)`
  color: ${colorGrayscale.gray900};
`

const Tabs = styled.div`
  width: 100%;
  margin-top: 24px;
  display: flex;
  flex-direction: row;
  gap: 24px;
  border-bottom: 1px solid ${colorGrayscale.gray300};
  overflow-x: scroll;
  scrollbar-width: none;
  ${mq.mobileOnly`
    width: 100vw;
    margin-left: -24px;
    padding-left: 24px;
    padding-right: 24px;
  `}
  ${mq.desktopAndAbove`
    margin-top: 32px;
  `}
`

const FollowingSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-top: 32px;
  width: 100%;
  ${mq.tabletOnly`
    gap: 48px;
  `}
  ${mq.desktopAndAbove`
    padding-top: 40px;
    gap: 56px;
  `}
`

const SectionTitle = styled(H4)`
  color: ${colorGrayscale.gray900};
`

const SectionDescription = styled(P1)`
  color: ${colorGrayscale.gray700};
`

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

const TAB_CONFIG = [
  {
    text: '全部',
    key: 'all',
  },
  {
    text: '人物 ✕ 議題',
    key: 'following-combo',
  },
  {
    text: '議題',
    key: 'following-topic',
  },
  {
    text: '立委/議員',
    key: 'following-people',
  },
  {
    text: '發言全文',
    key: 'following-speech',
  },
  {
    text: '議案',
    key: 'following-bill',
  },
]

export const Following = () => {
  const [selectedTab, setSelectedTab] = useState('all')
  return (
    <FollowingContainer>
      <PageTitle text="我的追蹤" type={H1.Type.ARTICLE} />
      <Tabs>
        {TAB_CONFIG.map((tab) => (
          <Tab
            key={tab.key}
            text={tab.text}
            selected={selectedTab === tab.key}
            onClick={() => setSelectedTab(tab.key)}
          />
        ))}
      </Tabs>
      <FollowingSection>
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
                  title: 'Title 1',
                  description: 'Description 1',
                  billCount: 10,
                  speechCount: 5,
                  latestDataDate: '2024/06/01',
                },
                {
                  title: 'Title 2',
                  description: 'Description 2',
                  billCount: 8,
                  speechCount: 3,
                  latestDataDate: '2024/06/01',
                },
              ]}
            />
            <FollowingComboCard
              type={FollowingComboCard.Type.TOPIC}
              count={5}
              followingInfos={[
                {
                  title: 'Title 1',
                  description: 'Description 1',
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
                avatar="avatar_url"
                party="Party"
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
                avatar="avatar_url"
                party="Party"
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
                avatar="avatar_url"
                party="Party"
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
                avatar="avatar_url"
                party="Party"
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
                avatar="avatar_url"
                party="Party"
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
                avatar="avatar_url"
                party="Party"
                name="Name"
                description="第 11 屆｜台北市第 1 選舉區"
                count={5}
                latestDate="2024/06/01"
              />
            </DesktopAndAbove>
          </FollowingPeopleCardWrapper>
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
          </FollowingArticleSection>
        </SpeechSection>
      </FollowingSection>
    </FollowingContainer>
  )
}
