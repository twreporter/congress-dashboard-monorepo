/* eslint-disable react/display-name */
'use client'

import React, { useState, useEffect, useRef, forwardRef } from 'react'
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
import {
  SidebarIssue,
  SidebarIssueProps,
  SidebarLegislator,
  SidebarLegislatorProps,
} from '@/components/sidebar'
import { GapHorizontal } from '@/components/skeleton'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { PillButton } from '@twreporter/react-components/lib/button'
import { TabletAndAbove } from '@twreporter/react-components/lib/rwd'

const Box = styled.div`
  background: ${colorGrayscale.gray100};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0 0 0;
  gap: 32px;

  ${mq.desktopOnly`
    padding: 40px 0 0 0 ;
  `}
  ${mq.tabletOnly`
    padding: 32px 0 0 0;
    gap: 24px;
  `}
  ${mq.mobileOnly`
    padding: 20px 0 0 0;
    gap: 20px;  
  `}
`
const StyledFunctionBar = styled(FunctionBar)`
  padding: 0 256px 0px 256px;

  ${mq.tabletOnly`
    padding: 0 32px 0px 32px;
  `}
  ${mq.mobileOnly`
    padding: 0 24px 0px 24px;
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
  width: 100%;
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
  transition: transform 0.3s ease-in-out;

  position: fixed;
  right: 0;
  top: 0;
  z-index: 3000;
  overflow-y: scroll;
`
const StyledSidebarIssue = styled(
  forwardRef<HTMLDivElement, SidebarIssueProps>((props, ref) => (
    <SidebarIssue {...props} ref={ref} />
  ))
)<{ $show: boolean }>`
  ${sidebarCss}
`
const StyledSidebarLegislator = styled(
  forwardRef<HTMLDivElement, SidebarLegislatorProps>((props, ref) => (
    <SidebarLegislator {...props} ref={ref} />
  ))
)<{ $show: boolean }>`
  ${sidebarCss}
`
const Gap = styled(GapHorizontal)`
  transition: width 0.3s ease-in-out;
`
const CardSection = styled.div<{
  $isScroll: boolean
  $isSidebarOpened: boolean
}>`
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  ${(props) =>
    props.$isScroll
      ? `
    overflow-x: scroll;
    scrollbar-width: none;
  `
      : ''}
  ${(props) =>
    props.$isSidebarOpened
      ? `
      width: 100vw;
      padding-left: 24px;
    `
      : `
      max-width: 928px;
  `}

  ${mq.tabletAndBelow`
    max-width: 100%;
    padding: 0 32px;
  `}

  ${mq.mobileOnly`
    padding: 0 24px;
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
  const [sidebarGap, setSidebarGap] = useState(0)
  const sidebarRefs = useRef<Map<number, HTMLDivElement>>(new Map(null))
  const cardRef = useRef<HTMLDivElement>(null)

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

    /* scroll to top when change tab
   *   not yet decided
    const anchorComponent = document.getElementById(anchorId)
    if (anchorComponent) {
      anchorComponent.scrollIntoView({ behavior: 'smooth' })
    }
  */
  }
  const loadMore = () => {
    setIsLoading(true)
  }
  const closeSidebar = () => {
    setShowSidebar(false)
    setSidebarGap(0)
    setActiveCardIndex(-1)
  }
  const onClickCard = (e: React.MouseEvent<HTMLElement>, index: number) => {
    setActiveCardIndex(index)

    let newSidebarGap = 520 + 24
    const sidebarComponent = sidebarRefs.current[selectedType]
    const cardComponent = cardRef.current
    if (sidebarComponent && cardComponent) {
      const needGap = sidebarComponent.clientWidth + 24
      const hasGap = cardComponent.offsetLeft
      if (cardComponent.clientWidth === 928) {
        // desktop and above
        newSidebarGap = hasGap > needGap ? 0 : needGap
      } else {
        newSidebarGap = needGap - hasGap
      }
    }
    setSidebarGap(newSidebarGap > 0 ? newSidebarGap : 0)

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
        }, 300)
      }
    }
  }

  return (
    <Box id={anchorId}>
      <StyledFunctionBar currentTab={selectedType} setTab={setTab} />
      <CardSection $isScroll={showSidebar} $isSidebarOpened={showSidebar}>
        <CardBox ref={cardRef}>
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
                ref={(el: HTMLDivElement) => {
                  sidebarRefs.current[Option.Issue] = el
                }}
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
                ref={(el: HTMLDivElement) => {
                  sidebarRefs.current[Option.Human] = el
                }}
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
        <Gap $gap={sidebarGap} />
      </CardSection>
    </Box>
  )
}
export default Dashboard
