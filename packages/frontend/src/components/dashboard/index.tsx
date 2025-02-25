'use client'

import React, { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
// config
import { mockHumans, mockIssues } from '@/components/dashboard/card/config'
// lib
import toastr from '@/lib/toastr'
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
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { PillButton } from '@twreporter/react-components/lib/button'

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
const CardIssueBox = styled.div<{ $active: boolean }>`
  ${cardCss}
  display: flex;
  flex-direction: column;
  gap: 24px;
  ${(props) => (props.$active ? '' : 'display: none !important;')}
`
const CardHumanBox = styled.div<{ $active: boolean }>`
  ${cardCss}
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

const Dashboard = () => {
  const [selectedType, setSelectedType] = useState(Option.Issue)
  const [activeCard, setActiveCard] = useState(-1)
  const [isLoading, setIsLoading] = useState(true)
  const [mockIssue, setMockIssue] = useState<CardIssueProps[]>([])
  const [mockHuman, setMockHuman] = useState<CardHumanProps[]>([])

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
  }, [selectedType])

  const setTab = (value: Option) => {
    setActiveCard(-1)
    setSelectedType(value)
  }
  const loadMore = () => {
    setIsLoading(true)
  }

  return (
    <Box>
      <FunctionBar currentTab={selectedType} setTab={setTab} />
      <CardIssueBox $active={selectedType === Option.Issue}>
        {mockIssue.map((props: CardIssueProps, index) => (
          <CardIssueRWD
            key={`issue-card-${index}`}
            {...props}
            selected={activeCard === index}
            onClick={() => setActiveCard(index)}
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
      </CardIssueBox>
      <CardHumanBox $active={selectedType === Option.Human}>
        {mockHuman.map((props: CardHumanProps, index: number) => (
          <CardHumanRWD
            key={`human-card-${index}`}
            {...props}
            selected={activeCard === index}
            onClick={() => setActiveCard(index)}
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
      </CardHumanBox>
      <LoadMore
        text={'載入更多'}
        theme={PillButton.THEME.normal}
        style={PillButton.Style.DARK}
        type={PillButton.Type.PRIMARY}
        size={PillButton.Size.L}
        onClick={loadMore}
      />
    </Box>
  )
}
export default Dashboard
