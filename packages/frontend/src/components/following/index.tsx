'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
import { H1 } from '@twreporter/react-components/lib/text/headline'
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
// components
import Tab from '@/components/dashboard/function-bar/tab'
import { FollowingAllSection } from '@/components/following/following-all-section'
import { FollowingComboSection } from '@/components/following/following-combo-section'
import { FollowingTopicSection } from '@/components/following/following-topic-section'
import { FollowingPeopleSection } from '@/components/following/following-people-section'
import { FollowingSpeechSection } from '@/components/following/following-speech-section'
import { FollowingBillSection } from '@/components/following/following-bill-section'
// constants
import {
  TAB_CONFIG,
  FOLLOWING_TAB,
  DEFAULT_FOLLOWING_TAB,
  getFollowingTabPath,
} from '@/components/following/constants'
import type { FollowingTabKey } from '@/components/following/constants'

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

const TabsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  width: max-content;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const TabItem = styled.div`
  display: flex;
  flex-shrink: 0;
`

const SECTION_BY_TAB: Record<FollowingTabKey, React.FC> = {
  [FOLLOWING_TAB.ALL]: FollowingAllSection,
  [FOLLOWING_TAB.COMBO]: FollowingComboSection,
  [FOLLOWING_TAB.TOPIC]: FollowingTopicSection,
  [FOLLOWING_TAB.PEOPLE]: FollowingPeopleSection,
  [FOLLOWING_TAB.SPEECH]: FollowingSpeechSection,
  [FOLLOWING_TAB.BILL]: FollowingBillSection,
}

type FollowingProps = {
  selectedTab?: FollowingTabKey
}

export const Following: React.FC<FollowingProps> = ({
  selectedTab = DEFAULT_FOLLOWING_TAB,
}) => {
  const router = useRouter()
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    tabRefs.current[selectedTab]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [selectedTab])

  const handleTabClick = useCallback(
    (key: FollowingTabKey) => {
      router.push(getFollowingTabPath(key))
    },
    [router]
  )

  const Section = SECTION_BY_TAB[selectedTab] ?? FollowingAllSection

  return (
    <FollowingContainer>
      <PageTitle text="我的追蹤" type={H1.Type.ARTICLE} />
      <Tabs>
        <TabsWrapper>
          {TAB_CONFIG.map((tab) => (
            <TabItem
              key={tab.key}
              ref={(el) => {
                tabRefs.current[tab.key] = el
              }}
            >
              <Tab
                text={tab.text}
                selected={selectedTab === tab.key}
                onClick={() => handleTabClick(tab.key)}
              />
            </TabItem>
          ))}
        </TabsWrapper>
      </Tabs>
      <Section />
    </FollowingContainer>
  )
}
