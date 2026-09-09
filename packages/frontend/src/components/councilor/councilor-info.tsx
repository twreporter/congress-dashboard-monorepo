'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import { P1 } from '@twreporter/react-components/lib/text/paragraph'
import {
  DesktopAndAbove,
  TabletAndBelow,
} from '@twreporter/react-components/lib/rwd'
import { OpenInNew } from '@twreporter/react-components/lib/icon'
// components
import PartyTag from '@/components/dashboard/card/party-tag'
import Tooltip from '@/components/dashboard/card/tooltip'
// enums
import { TagSize } from '@/components/dashboard/enum'
// types
import type { CouncilorForLawmaker } from '@/types/councilor'
// constants
import { CITY_LABEL } from '@twreporter/congress-dashboard-shared/lib/constants/city'
import { CARD_HUMAN_TYPE } from '@/components/dashboard/card/human'
import { formatAdministrativeDistrict } from '@/utils/councilor'
// styles
import { H3Gray900, P1Gray800 } from '@/components/legislator/styles'
import {
  InfoContainer,
  InfoImageContainer,
  Avatar,
  Mask,
  PartyTagContainer,
  InfoDetail,
  InfoContent,
  InfoItem,
  ItemTitle,
  ExternalLinkButton,
  Badge,
  BadgeText,
} from '@/components/legislator/legislator-info'

const TooltipContainer = styled.div`
  align-self: center;
  margin-left: -8px;
`

type CouncilorInfoProps = {
  councilor: CouncilorForLawmaker
}
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const CouncilorInfo: React.FC<CouncilorInfoProps> = ({ councilor }) => {
  const handleExternalLinkClick = () => {
    window.open(councilor.externalLink, '_blank')
  }

  const constituency = `${CITY_LABEL[councilor.councilMeeting.city]}第${
    councilor.constituency
  }選區`
  const administrativeDistrictString = formatAdministrativeDistrict({
    city: councilor.city,
    administrativeDistrict: councilor.administrativeDistrict,
    memberType: councilor.type,
  })

  return (
    <InfoContainer>
      <InfoImageContainer>
        <Avatar src={councilor.avatar} $cardType={CARD_HUMAN_TYPE.Councilor} />
        <DesktopAndAbove>
          <Mask />
        </DesktopAndAbove>
        <PartyTagContainer>
          <DesktopAndAbove>
            <PartyTag size={TagSize.XXL} avatar={councilor.party.image} />
          </DesktopAndAbove>
          <TabletAndBelow>
            <PartyTag size={TagSize.XL} avatar={councilor.party.image} />
          </TabletAndBelow>
        </PartyTagContainer>
      </InfoImageContainer>
      <InfoDetail>
        <InfoItem>
          <H3Gray900 text={councilor.name} />
          {councilor.externalLink ? (
            <ExternalLinkButton
              iconComponent={
                <OpenInNew
                  releaseBranch={releaseBranch}
                  onClick={handleExternalLinkClick}
                />
              }
            />
          ) : null}
        </InfoItem>
        <InfoContent>
          <InfoItem>
            <ItemTitle>
              <P1Gray800 text="屆別" />
            </ItemTitle>
            <P1Gray800
              weight={P1.Weight.BOLD}
              text={`第${councilor.councilMeeting.term}屆${
                CITY_LABEL[councilor.councilMeeting.city]
              }議員`}
            />
            {councilor.isActive ? (
              <Badge>
                <BadgeText text={'現任'} />
              </Badge>
            ) : null}
          </InfoItem>
          <InfoItem>
            <ItemTitle>
              <P1Gray800 text="黨籍" />
            </ItemTitle>
            <P1Gray800 weight={P1.Weight.BOLD} text={councilor.party.name} />
          </InfoItem>
          <InfoItem>
            <ItemTitle>
              <P1Gray800 text="選區" />
            </ItemTitle>
            <P1Gray800 weight={P1.Weight.BOLD} text={constituency} />
            {administrativeDistrictString ? (
              <TooltipContainer>
                <Tooltip
                  tooltip={`選區涵蓋之行政區：${administrativeDistrictString}`}
                />
              </TooltipContainer>
            ) : null}
          </InfoItem>
          <InfoItem>
            <ItemTitle>
              <P1Gray800 text="備註" />
            </ItemTitle>
            <P1Gray800 weight={P1.Weight.BOLD} text={councilor.tooltip} />
          </InfoItem>
        </InfoContent>
      </InfoDetail>
    </InfoContainer>
  )
}

export default CouncilorInfo
