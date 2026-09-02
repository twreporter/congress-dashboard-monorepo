'use client'
import React from 'react'
import styled from 'styled-components'
import mq from '@twreporter/core/lib/utils/media-query'
// components
import { P1Gray800 } from '@/components/legislator/styles'
import Tooltip from '@/components/dashboard/card/tooltip'
// styles
import {
  StatisticContainer,
  CountInfoContainer,
  CountInfo,
  CountInfoTitle,
  CountInfoValue,
} from '@/components/legislator/legislator-statistics'

const CouncilorCountInfoContainer = styled(CountInfoContainer)`
  flex: 1;
  justify-content: space-between;

  ${CountInfo} {
    flex: 1;
  }

  ${mq.mobileOnly`
    gap: 12px;
  `}
`

type CouncilorStatisticsProps = {
  speechCount: number
  proposalSuccessCount: number
  meetingTermCount: number
  meetingTermCountInfo: string
}
const CouncilorStatistics: React.FC<CouncilorStatisticsProps> = ({
  speechCount,
  proposalSuccessCount,
  meetingTermCount,
  meetingTermCountInfo,
}) => {
  const isOverMaxCount =
    speechCount > 999 || proposalSuccessCount > 999 || meetingTermCount > 999
  return (
    <StatisticContainer>
      <CouncilorCountInfoContainer>
        <CountInfo>
          <CountInfoTitle>
            <P1Gray800 text="發言數" />
          </CountInfoTitle>
          <CountInfoValue $isOverMaxNumber={isOverMaxCount}>
            {speechCount > 999 ? '999+' : speechCount}
          </CountInfoValue>
        </CountInfo>
        <CountInfo>
          <CountInfoTitle>
            <P1Gray800 text="提案數" />
            <Tooltip tooltip="僅統計本屆期的提案數" />
          </CountInfoTitle>
          <CountInfoValue $isOverMaxNumber={isOverMaxCount}>
            {proposalSuccessCount > 999 ? '999+' : proposalSuccessCount}
          </CountInfoValue>
        </CountInfo>
        <CountInfo>
          <CountInfoTitle>
            <P1Gray800 text="議員任期屆數" />
            {meetingTermCountInfo ? (
              <Tooltip tooltip={meetingTermCountInfo} />
            ) : null}
          </CountInfoTitle>
          <CountInfoValue $isOverMaxNumber={isOverMaxCount}>
            {meetingTermCount > 999 ? '999+' : meetingTermCount}
          </CountInfoValue>
        </CountInfo>
      </CouncilorCountInfoContainer>
    </StatisticContainer>
  )
}

export default CouncilorStatistics
