import React from 'react'
import {
  StatisticsBlock,
  StatisticsDiv,
  P1Gray800,
  StatisticsNumber,
} from '@/components/topic/styles'

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
