'use client'

import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
// config
import { mockHumans, mockIssues } from '@/components/dashboard/card/config'
import {
  mockSidebarIssueProps,
  mockSidebarLegislatorProps,
} from '@/components/sidebar/config'
// utils
import toastr from '@/utils/toastr'
// components
import FunctionBar, { Option } from '@/components/dashboard/function-bar'
import {
  CardIssueRWD,
  CardIssueProps,
  CardIssueSkeletonRWD,
} from '@/components/dashboard/card/issue'
import {
  CardHumanRWD,
  CardHumanProps,
  CardHumanSkeletonRWD,
} from '@/components/dashboard/card/human'
import { SidebarIssue, SidebarLegislator } from '@/components/sidebar'
import { GapHorizontal } from '@/components/skeleton'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { PillButton } from '@twreporter/react-components/lib/button'
import { TabletAndAbove } from '@twreporter/react-components/lib/rwd'

const Box = styled.div`
  background: ${colorGrayscale.gray100};
  display: flex;
  padding: 40px 256px 0px 256px;
  flex-direction: column;
  align-items: center;
  gap: 32px;

  ${mq.desktopOnly`
    padding: 40px 48px 0px 48px;
  `}
  ${mq.tabletOnly`
    padding: 32px 32px 0px 32px;
    gap: 24px;
  `}
  ${mq.mobileOnly`
    padding: 20px 24px 0px 24px;
    gap: 20px;  
  `}
`
const cardCss = css`
  width: 928px;

  ${mq.tabletAndBelow`
    width: 100%;
  `}
`
const CardBox = styled.div`
  ${cardCss}
  display: flex;
  flex-direction: column;
  align-items: center;
`
const CardIssueBox = styled.div<{ $active: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  ${(props) => (props.$active ? '' : 'display: none !important;')}
`
const CardHumanBox = styled.div<{ $active: boolean }>`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 24px;
  ${(props) => (props.$active ? '' : 'display: none !important;')}

  ${mq.mobileOnly`
    grid-template-columns: repeat(1, 1fr);
    grid-gap: 20px;
  `}
`
const LoadMore = styled(PillButton)`
  margin: 64px 0 120px 0;
  justify-content: center;
  width: 300px !important;

  ${mq.mobileOnly`
    margin: 32px 0 64px 0;
    width: calc(100% - 32px) !important;
  `}
`
const sidebarCss = css<{ $show: boolean }>`
  transform: translateX(${(props) => (props.$show ? 0 : 520)}px);
  transition: transform 0.5s ease-in-out;

  position: fixed;
  right: 0;
  top: 0;
  z-index: 3000;
  overflow-y: scroll;
`
const StyledSidebarIssue = styled(SidebarIssue)<{ $show: boolean }>`
  ${sidebarCss}
`
const StyledSidebarLegislator = styled(SidebarLegislator)<{ $show: boolean }>`
  ${sidebarCss}
`
const Gap = styled(GapHorizontal)<{ $show: boolean }>`
  ${(props) => (props.$show ? '' : 'width: 0;')}
  transition: width 0.5s ease-in-out;
`
const CardSection = styled.div<{ $isScroll: boolean }>`
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  ${(props) =>
    props.$isScroll
      ? `
    overflow-x: scroll;
  `
      : ''}

  max-width: 928px;
  ${mq.tabletAndBelow`
    max-width: 100%;  
  `}

  ${CardBox}, ${Gap} {
    flex: none;
  }
`

const anchorId = 'anchor-id'
const Dashboard = () => {
  const [selectedType, setSelectedType] = useState(Option.Issue)
  const [activeCardIndex, setActiveCardIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(true)
  const [mockIssue, setMockIssue] = useState<CardIssueProps[]>([])
  const [mockHuman, setMockHuman] = useState<CardHumanProps[]>([])
  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    if (isLoading) {
      window.setTimeout(() => {
        setMockIssue(mockIssues)
        setMockHuman(mockHumans)
        setIsLoading(false)
        if (selectedType === Option.Human) {
          toastr({ text: '立委為隨機排列' })
        }
      }, 2000)
    }
  }, [isLoading])
  useEffect(() => {
    setIsLoading(true)
    setMockIssue([])
    setMockHuman([])
    setShowSidebar(false)
  }, [selectedType])
  useEffect(() => {
    if (activeCardIndex > -1) {
      setShowSidebar(true)
    }
  }, [activeCardIndex])

  const setTab = (value: Option) => {
    setActiveCardIndex(-1)
    setSelectedType(value)

    // scroll to top when change tab
    const anchorComponent = document.getElementById(anchorId)
    if (anchorComponent) {
      anchorComponent.scrollIntoView({ behavior: 'smooth' })
    }
  }
  const loadMore = () => {
    setIsLoading(true)
  }
  const closeSidebar = () => {
    setShowSidebar(false)
    setActiveCardIndex(-1)
  }
  const onClickCard = (e: React.MouseEvent<HTMLElement>, index: number) => {
    setActiveCardIndex(index)

    const cardElement = e.currentTarget as HTMLElement
    if (cardElement) {
      cardElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      })
      if (!showSidebar && selectedType === Option.Human) {
        window.setTimeout(() => {
          cardElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
          })
        }, 500)
      }
    }
  }

  return (
    <Box id={anchorId}>
      <FunctionBar currentTab={selectedType} setTab={setTab} />
      <CardSection $isScroll={showSidebar}>
        <CardBox>
          <CardIssueBox $active={selectedType === Option.Issue}>
            {mockIssue.map((props: CardIssueProps, index) => (
              <CardIssueRWD
                key={`issue-card-${index}`}
                {...props}
                selected={activeCardIndex === index}
                onClick={(e: React.MouseEvent<HTMLElement>) =>
                  onClickCard(e, index)
                }
              />
            ))}
            {isLoading ? (
              <>
                <CardIssueSkeletonRWD />
                <CardIssueSkeletonRWD />
                <CardIssueSkeletonRWD />
                <CardIssueSkeletonRWD />
              </>
            ) : null}
            <TabletAndAbove>
              <StyledSidebarIssue
                $show={showSidebar}
                {...mockSidebarIssueProps}
                onClose={closeSidebar}
              />
            </TabletAndAbove>
          </CardIssueBox>
          <CardHumanBox $active={selectedType === Option.Human}>
            {mockHuman.map((props: CardHumanProps, index: number) => (
              <CardHumanRWD
                key={`human-card-${index}`}
                {...props}
                selected={activeCardIndex === index}
                onClick={(e: React.MouseEvent<HTMLElement>) =>
                  onClickCard(e, index)
                }
              />
            ))}
            {isLoading ? (
              <>
                <CardHumanSkeletonRWD />
                <CardHumanSkeletonRWD />
                <CardHumanSkeletonRWD />
                <CardHumanSkeletonRWD />
              </>
            ) : null}
            <TabletAndAbove>
              <StyledSidebarLegislator
                $show={showSidebar}
                {...mockSidebarLegislatorProps}
                onClose={closeSidebar}
              />
            </TabletAndAbove>
          </CardHumanBox>
          <LoadMore
            text={'載入更多'}
            theme={PillButton.THEME.normal}
            style={PillButton.Style.DARK}
            type={PillButton.Type.PRIMARY}
            size={PillButton.Size.L}
            onClick={loadMore}
          />
        </CardBox>
        <Gap $gap={520} $show={showSidebar} />
      </CardSection>
    </Box>
  )
}
export default Dashboard
