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

const Dashboard = () => {
  const [selectedType, setSelectedType] = useState(Option.Issue)
  const [activeCard, setActiveCard] = useState(-1)
  const setTab = (value: Option) => {
    setActiveCard(-1)
    setSelectedType(value)
  }
  const loadMore = () => {
    alert('load more')
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
