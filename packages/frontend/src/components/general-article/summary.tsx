'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
// constants
import {
  FontSize,
  FontSizeOffset,
} from '@/components/general-article/constants'
// utils
import { notoSerif } from '@/utils/font'

const Container = styled.div`
  margin-top: 40px;
  ${mq.tabletAndBelow`
    margin-top: 0;
  `}
`

const Text = styled.div<{ $fontSizeOffset: number }>`
  font-family: ${notoSerif.style.fontFamily};
  color: ${colorGrayscale.gray600};
  font-size: ${(props) => props.$fontSizeOffset + 20}px;
  font-weight: 700;
  line-height: 170%;
  letter-spacing: 0.7px;
`

const StyledUnorderedList = styled.ul`
  list-style-position: outside;
  margin-left: 24px;
  ${mq.desktopOnly`
    margin-left: 20px;
  `}
`

const StyledListItem = styled.li<{ $fontSizeOffset: number }>`
  font-family: ${notoSerif.style.fontFamily};
  color: ${colorGrayscale.gray600};
  font-size: ${(props) => props.$fontSizeOffset + 20}px;
  font-weight: 700;
  line-height: 170%;
  letter-spacing: 0.7px;
  &::marker {
    color: ${colorGrayscale.gray600};
    font-size: ${(props) => props.$fontSizeOffset + 20}px;
    font-weight: 700;
    line-height: 170%;
    letter-spacing: 0.7px;
  }
`

type SummaryProps = {
  summary: string | string[]
  fontSizeOffset?: number
}
const Summary: React.FC<SummaryProps> = ({
  summary,
  fontSizeOffset = FontSizeOffset[FontSize.SMALL],
}) => {
  const summaryJSX = Array.isArray(summary) ? (
    <StyledUnorderedList>
      {summary.map((summary, i) => {
        return (
          <StyledListItem key={`summary-${i}`} $fontSizeOffset={fontSizeOffset}>
            {summary}
          </StyledListItem>
        )
      })}
    </StyledUnorderedList>
  ) : (
    <Text $fontSizeOffset={fontSizeOffset}>{summary}</Text>
  )
  return <Container>{summaryJSX}</Container>
}

export default Summary
