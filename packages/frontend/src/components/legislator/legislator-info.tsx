'use client'
import React from 'react'
import styled from 'styled-components'
// @twreporter
import {
  colorGrayscale,
  colorSupportive,
} from '@twreporter/core/lib/constants/color'
import mq from '@twreporter/core/lib/utils/media-query'
import { P1, P2 } from '@twreporter/react-components/lib/text/paragraph'
import {
  DesktopAndAbove,
  TabletAndBelow,
} from '@twreporter/react-components/lib/rwd'
import { IconButton } from '@twreporter/react-components/lib/button'
import { OpenInNew } from '@twreporter/react-components/lib/icon'
// styles
import { H3Gray900, P1Gray800 } from '@/components/legislator/styles'
// components
import PartyTag from '@/components/dashboard/card/party-tag'
// enums
import { TagSize } from '@/components/dashboard/enum'
// fetcher
import { type Legislator } from '@/components/legislator/hooks/use-legislator-data'

const LegislatorInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${colorGrayscale.white};
  border-radius: 8px;
  align-items: center;
  ${mq.tabletOnly`
    padding: 32px 24px;
    flex-direction: row;
    width: 100%;
    gap: 32px;
  `}
  ${mq.mobileOnly`
    width: 100%;
    padding: 24px;
    gap: 20px;
  `}
`

const LegislatorImageContainer = styled.div`
  position: relative;
  height: fit-content;
  width: 300px;
  aspect-ratio: 3.5 / 4.5;
  ${mq.desktopOnly`
    width: 272px;
  `}
  ${mq.tabletOnly`
    width: 164px;
    aspect-ratio: 1/1;
    height: 100%;
  `}
  ${mq.mobileOnly`
    width: 144px;
    aspect-ratio: 1/1;
    height: 100%;
  `}
`

const LegislatorImage = styled.img`
  width: 300px;
  aspect-ratio: 3.5 / 4.5;
  border-radius: 8px 8px 0 0;
  border: 1px solid rgba(0, 0, 0, 0.07);
  ${mq.desktopOnly`
    width: 272px;
  `}
  ${mq.tabletOnly`
    width: 164px;
    aspect-ratio: 1/1;
    border-radius: 50%;
  `}
  ${mq.mobileOnly`
    width: 144px;
    aspect-ratio: 1/1;
    border-radius: 50%;
  `}
`

const Mask = styled.div`
  opacity: 0.1;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000 100%);
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 80px;
`

const PartyTagContainer = styled.div`
  position: absolute;
  ${mq.desktopAndAbove`
    bottom: 16px;
    left: 16px;
  `}
  ${mq.tabletAndBelow`
    right: 0px;
    bottom: 0px;
  `}
`

const LegislatorDetail = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 16px;
  align-self: flex-start;
  ${mq.tabletAndBelow`
    padding: 0;
  `}
`

const LegislatorInfoTitle = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
`

const LegislatorInfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`

const Badge = styled.div`
  display: flex;
  padding: 2px 6px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: ${colorSupportive.faded};
`

const BadgeText = styled(P2)`
  color: ${colorSupportive.heavy};
`

const ExternalLinkButton = styled(IconButton)`
  width: 24px;
  height: 24px;
`

type LegislatorInfoProps = {
  legislator: Legislator
  isLegislatorActive?: boolean
}
const releaseBranch = process.env.NEXT_PUBLIC_RELEASE_BRANCH
const LegislatorInfo: React.FC<LegislatorInfoProps> = ({
  legislator,
  isLegislatorActive = false,
}) => {
  const handleExternalLinkClick = () => {
    window.open(legislator.externalLink, '_blank')
  }
  return (
    <LegislatorInfoDiv>
      <LegislatorImageContainer>
        <LegislatorImage src={legislator.avatar} />
        <DesktopAndAbove>
          <Mask />
        </DesktopAndAbove>
        <PartyTagContainer>
          <DesktopAndAbove>
            <PartyTag size={TagSize.XXL} avatar={legislator.party.image} />
          </DesktopAndAbove>
          <TabletAndBelow>
            <PartyTag size={TagSize.XL} avatar={legislator.party.image} />
          </TabletAndBelow>
        </PartyTagContainer>
      </LegislatorImageContainer>
      <LegislatorDetail>
        <LegislatorInfoTitle>
          <H3Gray900 text={legislator.name} />
          {legislator.externalLink ? (
            <ExternalLinkButton
              iconComponent={
                <OpenInNew
                  releaseBranch={releaseBranch}
                  onClick={handleExternalLinkClick}
                />
              }
            />
          ) : null}
        </LegislatorInfoTitle>
        <LegislatorInfoContent>
          <InfoItem>
            <P1Gray800 text="屆別" />
            <P1Gray800
              weight={P1.Weight.BOLD}
              text={`第${legislator.meetingTerm}屆立法委員`}
            />
            {isLegislatorActive ? (
              <Badge>
                <BadgeText text={'現任'} />
              </Badge>
            ) : null}
          </InfoItem>
          <InfoItem>
            <P1Gray800 text="黨籍" />
            <P1Gray800 weight={P1.Weight.BOLD} text={legislator.party.name} />
          </InfoItem>
          <InfoItem>
            <P1Gray800 text="選區" />
            <P1Gray800 weight={P1.Weight.BOLD} text={legislator.constituency} />
          </InfoItem>
          <InfoItem>
            <P1Gray800 text="備註" />
            <P1Gray800 weight={P1.Weight.BOLD} text={legislator.tooltip} />
          </InfoItem>
        </LegislatorInfoContent>
      </LegislatorDetail>
    </LegislatorInfoDiv>
  )
}

export default LegislatorInfo
