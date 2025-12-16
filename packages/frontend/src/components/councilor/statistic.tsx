'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
// components
import { P1Gray800 } from '@/components/legislator/styles'
import Tooltip from '@/components/dashboard/card/tooltip'
// styles
import {
  StatisticContainer,
  Separator,
  CountInfoContainer,
  CountInfo,
  CountInfoTitle,
  CountInfoValue,
} from '@/components/legislator/legislator-statistics'

const AdministrativeDistrict = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  ${mq.hdOnly`
    width: 266px;
  `}
  ${mq.desktopAndBelow`
    flex: 50%;
  `}
`

type CouncilorStatisticsProps = {
  administrativeDistrict: string[]
  proposalSuccessCount: number
  meetingTermCount: number
  meetingTermCountInfo: string
}
const CouncilorStatistics: React.FC<CouncilorStatisticsProps> = ({
  administrativeDistrict,
  proposalSuccessCount,
  meetingTermCount,
  meetingTermCountInfo,
}) => {
  const administrativeDistrictString = administrativeDistrict.join('、')
  const isOverMaxCount = proposalSuccessCount > 999 || meetingTermCount > 999
  return (
    <StatisticContainer>
      <AdministrativeDistrict>
        <P1Gray800 text="選區涵蓋之行政區" />
        <P1Gray800
          text={administrativeDistrictString}
          weight={P1Gray800.Weight.BOLD}
        />
      </AdministrativeDistrict>
      <Separator />
      <CountInfoContainer>
        <CountInfo>
          <CountInfoTitle>
            <P1Gray800 text="提案通過數" />
            <Tooltip tooltip="僅統計所選屆期的主提法案三讀通過數" />
          </CountInfoTitle>
          <CountInfoValue $isOverMaxNumber={isOverMaxCount}>
            {proposalSuccessCount > 999 ? '999+' : proposalSuccessCount}
          </CountInfoValue>
        </CountInfo>
        <CountInfo>
          <CountInfoTitle>
            <P1Gray800 text="立委任期屆數" />
            {meetingTermCountInfo ? (
              <Tooltip tooltip={meetingTermCountInfo} />
            ) : null}
          </CountInfoTitle>
          <CountInfoValue $isOverMaxNumber={isOverMaxCount}>
            {meetingTermCount > 999 ? '999+' : meetingTermCount}
          </CountInfoValue>
        </CountInfo>
      </CountInfoContainer>
    </StatisticContainer>
  )
}

export default CouncilorStatistics
