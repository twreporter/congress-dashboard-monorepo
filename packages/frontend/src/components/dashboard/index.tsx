'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
// config
import { mockHumans, mockIssues } from './card/config'
// components
import FunctionBar, { Option } from './function-bar'
import { CardIssueRWD, CardIssueProps } from './card/issue'
import { CardHumanRWD, CardHumanProps } from './card/human'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'

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

const Dashboard = () => {
  const [selectedType, setSelectedType] = useState(Option.Issue)
  const [activeCard, setActiveCard] = useState(-1)
  const setTab = (value: Option) => {
    console.log('set tab', value)
    setActiveCard(-1)
    setSelectedType(value)
  }
  return (
    <Box>
      <FunctionBar currentTab={selectedType} setTab={setTab} />
      <CardIssueBox $active={selectedType === Option.Issue}>
        {mockIssues.map((props: CardIssueProps, index) => (
          <CardIssueRWD
            key={`issue-card-${index}`}
            {...props}
            selected={activeCard === index}
            onClick={() => setActiveCard(index)}
          />
        ))}
      </CardIssueBox>
      <CardHumanBox $active={selectedType === Option.Human}>
        {mockHumans.map((props: CardHumanProps, index: number) => (
          <CardHumanRWD
            key={`human-card-${index}`}
            {...props}
            selected={activeCard === index}
            onClick={() => setActiveCard(index)}
          />
        ))}
      </CardHumanBox>
    </Box>
  )
}
export default Dashboard
