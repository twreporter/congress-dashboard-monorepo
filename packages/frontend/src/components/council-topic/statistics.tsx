'use client'
import React from 'react'
import styled from 'styled-components'
import mq from '@twreporter/core/lib/utils/media-query'
// components
import { P1Gray800 } from '@/components/topic/styles'
// style
import {
  StatisticsBlock,
  StatisticsDiv,
  StatisticsNumber,
} from '@/components/topic/topic-statistics'

const CouncilStatisticsBlock = styled(StatisticsBlock)`
  flex-wrap: wrap;
`

const CouncilStatisticsDiv = styled(StatisticsDiv)`
  width: calc(50% - 10px);

  ${mq.tabletOnly`
    width: calc(25% - 15px);
  `}
`

type TopicStatisticsProps = {
  speechCouncilorCount: number
  speechCount: number
  billCouncilorCount: number
  billCount: number
}

const metrics: Array<{
  key: keyof TopicStatisticsProps
  label: string
}> = [
  { key: 'speechCouncilorCount', label: '發言人數' },
  { key: 'speechCount', label: '發言總數' },
  { key: 'billCouncilorCount', label: '提案人數' },
  { key: 'billCount', label: '議案總數' },
]

const TopicStatistics: React.FC<TopicStatisticsProps> = ({ ...counts }) => {
  return (
    <CouncilStatisticsBlock>
      {metrics.map(({ key, label }) => {
        const count = counts[key]
        return (
          <CouncilStatisticsDiv key={key}>
            <P1Gray800 text={label} />
            <StatisticsNumber>{count > 999 ? '999+' : count}</StatisticsNumber>
          </CouncilStatisticsDiv>
        )
      })}
    </CouncilStatisticsBlock>
  )
}

export default TopicStatistics
