'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
// components
import { P1Gray800 } from '@/components/topic/styles'

const StatisticsBlock = styled.div`
  display: flex;
  padding: 32px 24px;
  border-radius: 8px;
  background-color: ${colorGrayscale.white};
  justify-content: space-between;
  gap: 20px;
  ${mq.tabletAndBelow`
    width: 100%;
  `}
`

const StatisticsDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`

const StatisticsNumber = styled.div`
  color: ${colorGrayscale.gray800};
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
`

type TopicStatisticsProps = {
  legislatorCount: number
  speechesCount?: number
}

const TopicStatistics: React.FC<TopicStatisticsProps> = ({
  legislatorCount,
  speechesCount = 0,
}) => {
  return (
    <StatisticsBlock>
      <StatisticsDiv>
        <P1Gray800 text="發言立委人數" />
        <StatisticsNumber>{legislatorCount}</StatisticsNumber>
      </StatisticsDiv>
      <StatisticsDiv>
        <P1Gray800 text="發言總數" />
        <StatisticsNumber>{speechesCount}</StatisticsNumber>
      </StatisticsDiv>
    </StatisticsBlock>
  )
}

export default TopicStatistics
