'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'

const Container = styled.div`
  margin-top: 40px;
  ${mq.tabletAndBelow`
    margin-top: 0;
  `}
`

const Text = styled.div`
  color: ${colorGrayscale.gray600};
  font-size: 20px;
  font-weight: 700;
  line-height: 170%;
  letter-spacing: 0.7px;
`

const StyledOrderedList = styled.ol`
  list-style-position: outside;
  margin-left: 24px;
  ${mq.desktopOnly`
    margin-left: 20px;
  `}
`

const StyledListItem = styled.li`
  color: ${colorGrayscale.gray600};
  font-size: 20px;
  font-weight: 700;
  line-height: 170%;
  letter-spacing: 0.7px;
  &::marker {
    color: ${colorGrayscale.gray600};
    font-size: 20px;
    font-weight: 700;
    line-height: 170%;
    letter-spacing: 0.7px;
  }
`

type SpeechSummaryProps = {
  summary: string | string[]
}
const SpeechSummary: React.FC<SpeechSummaryProps> = ({ summary }) => {
  const summaryJSX = Array.isArray(summary) ? (
    <StyledOrderedList>
      {summary.map((summary, i) => {
        return <StyledListItem key={`summary-${i}`}>{summary}</StyledListItem>
      })}
    </StyledOrderedList>
  ) : (
    <Text>{summary}</Text>
  )
  return <Container>{summaryJSX}</Container>
}

export default SpeechSummary
