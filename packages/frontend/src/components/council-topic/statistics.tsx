'use client'
import React from 'react'
// components
import { P1Gray800 } from '@/components/topic/styles'
// style
import {
  StatisticsBlock,
  StatisticsDiv,
  StatisticsNumber,
} from '@/components/topic/topic-statistics'

type TopicStatisticsProps = {
  councilorCount: number
  billCount?: number
}

const TopicStatistics: React.FC<TopicStatisticsProps> = ({
  councilorCount,
  billCount = 0,
}) => {
  return (
    <StatisticsBlock>
      <StatisticsDiv>
        <P1Gray800 text="提案議員人數" />
        <StatisticsNumber>
          {councilorCount > 999 ? '999+' : councilorCount}
        </StatisticsNumber>
      </StatisticsDiv>
      <StatisticsDiv>
        <P1Gray800 text="議案總數" />
        <StatisticsNumber>
          {billCount > 999 ? '999+' : billCount}
        </StatisticsNumber>
      </StatisticsDiv>
    </StatisticsBlock>
  )
}

export default TopicStatistics
