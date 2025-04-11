'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { colorGrayscale } from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
// components
import { P1Gray800 } from '@/components/legislator/styles'
import Tooltip from '@/components/dashboard/card/tooltip'

const LegislatorStatisticsDiv = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${colorGrayscale.white};
  border-radius: 8px;
  padding: 32px 24px;
  width: 100%;
  ${mq.mobileOnly`
    padding: 24px;
    flex-direction: column;
  `}
`

const CurrentCommittee = styled.div`
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

const Committees = styled.div`
  display: flex;
  flex-direction: column;
`

const CommitteeText = styled.div`
  color: ${colorGrayscale.gray800};
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 180%;
`

const Separator = styled.div`
  width: 1px;
  background-color: ${colorGrayscale.gray300};
  margin-left: 56px;
  margin-right: 56px;
  ${mq.desktopOnly`
    margin-left: 0px;
    margin-right: 24px;
  `}
  ${mq.tabletOnly`
    margin-left: 24px;
    margin-right: 24px;
  `}
  ${mq.mobileOnly`
    width: 100%;
    height: 1px;
    margin: 24px 0;
  `}
`

const CountInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  ${mq.desktopAndBelow`
    flex: 50%;
  `}
`

const CountInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  ${mq.hdOnly`
    width: 175px;
  `}
  ${mq.desktopAndBelow`
    flex: 50%;
  `}
`

const CountInfoTitle = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
`

const CountInfoValue = styled.div<{ $isOverMaxNumber?: boolean }>`
  height: 100%;
  display: flex;
  align-items: center;
  color: ${colorGrayscale.gray800};
  font-size: 72px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
  ${mq.desktopOnly`
    font-size: ${(props) => (props.$isOverMaxNumber ? 56 : 72)}px;
  `}
  ${mq.tabletOnly`
    font-size: 64px;
  `}
  ${mq.mobileOnly`
    font-size: 48px;
  `}
`
type LegislatorStatisticsProps = {
  committees: {
    name: string
    count: number
  }[]
  proposalSuccessCount: number
  meetingTermCount: number
  meetingTermCountInfo: string
}
const LegislatorStatistics: React.FC<LegislatorStatisticsProps> = ({
  committees,
  proposalSuccessCount,
  meetingTermCount,
  meetingTermCountInfo,
}) => {
  const isOverMaxCount = proposalSuccessCount > 999 || meetingTermCount > 999
  return (
    <LegislatorStatisticsDiv>
      <CurrentCommittee>
        <P1Gray800 text="本屆加入" />
        <Committees>
          {committees.map((committee, index) => (
            <CommitteeText key={index}>
              {`${committee.name} (${committee.count}會期)`}
            </CommitteeText>
          ))}
        </Committees>
      </CurrentCommittee>
      <Separator />
      <CountInfoContainer>
        <CountInfo>
          <CountInfoTitle>
            <P1Gray800 text="提案通過數" />
            <Tooltip tooltip="僅統計所選屆期的主提案通過數" />
          </CountInfoTitle>
          <CountInfoValue $isOverMaxNumber={isOverMaxCount}>
            {proposalSuccessCount > 999 ? '999+' : proposalSuccessCount}
          </CountInfoValue>
        </CountInfo>
        <CountInfo>
          <CountInfoTitle>
            <P1Gray800 text="立委任期屆數" />
            <Tooltip tooltip={meetingTermCountInfo} />
          </CountInfoTitle>
          <CountInfoValue $isOverMaxNumber={isOverMaxCount}>
            {meetingTermCount > 999 ? '999+' : meetingTermCount}
          </CountInfoValue>
        </CountInfo>
      </CountInfoContainer>
    </LegislatorStatisticsDiv>
  )
}

export default LegislatorStatistics
