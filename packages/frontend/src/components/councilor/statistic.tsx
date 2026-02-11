'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
import { getDistrictsByCity } from '@twreporter/congress-dashboard-shared/lib/constants/city-district'
import {
  CITY_LABEL,
  type City,
} from '@twreporter/congress-dashboard-shared/lib/constants/city'
import {
  MEMBER_TYPE,
  MEMBER_TYPE_LABEL,
  MemberType,
} from '@twreporter/congress-dashboard-shared/lib/constants/council-member'
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
  city: City
  councilorType: MemberType
  administrativeDistrict: string[]
  proposalSuccessCount: number
  meetingTermCount: number
  meetingTermCountInfo: string
}
const CouncilorStatistics: React.FC<CouncilorStatisticsProps> = ({
  city,
  councilorType,
  administrativeDistrict,
  proposalSuccessCount,
  meetingTermCount,
  meetingTermCountInfo,
}) => {
  const allDistricts = getDistrictsByCity(city)
  let administrativeDistrictString =
    allDistricts.length === administrativeDistrict.length
      ? `${CITY_LABEL[city]}全區`
      : administrativeDistrict.join('、')
  if (
    councilorType === MEMBER_TYPE.highlandAboriginal ||
    councilorType === MEMBER_TYPE.lowlandAboriginal
  ) {
    administrativeDistrictString += `（${MEMBER_TYPE_LABEL[councilorType]}）`
  }
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
            <Tooltip tooltip="僅統計本屆期的提案通過數" />
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
      </CountInfoContainer>
    </StatisticContainer>
  )
}

export default CouncilorStatistics
