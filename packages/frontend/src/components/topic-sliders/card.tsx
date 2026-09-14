'use client'
import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
// @twreporter
import mq from '@twreporter/core/lib/utils/media-query'
import {
  colorOpacity,
  colorGrayscale,
} from '@twreporter/core/lib/constants/color'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
// constants
import { InternalRoutes } from '@/constants/routes'

const StyledLink = styled(Link)`
  text-decoration: none;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 271px;
  padding: 24px;
  gap: 20px;
  background-color: ${colorGrayscale.white};
  border-radius: 4px;
  border: 1px solid ${colorOpacity['black_0.1']};
  ${mq.tabletAndBelow`
    width: 300px;
    height: 246px;
  `}
  &:hover {
    cursor: pointer;
    border-color: ${colorOpacity['black_0.2']};
    box-shadow: 0 0 16px 0 ${colorOpacity['black_0.1']};
  }
`

const UpperSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding-bottom: 12px;
  border-bottom: 1px solid ${colorOpacity['black_0.1']};
`

const LowerSection = styled.div`
  display: flex;
  justify-content: space-between;
`

const Title = styled(H4)`
  color: ${colorGrayscale.gray900};
`

const Metrics = styled.div`
  display: flex;
  gap: 20px;
  color: ${colorGrayscale.gray900};
`

const Metric = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const MetricNumber = styled.div`
  font-family: 'Roboto Slab';
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
  ${mq.tabletAndBelow`
    font-size: 44px;
  `}
`

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const Avatar = styled.img<{ $ZIndex: number }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${colorOpacity['black_0.05']};
  object-fit: cover;
  margin-left: -4px;
  z-index: ${(props) => props.$ZIndex};
  &:first-child {
    margin-left: 0;
  }
`

const CouncilorCount = styled(P2)`
  color: ${colorGrayscale.gray800};
`

export type CardProps = {
  title: string
  slug: string
  city: string
  billCount: number
  speechCount: number
  avatars: string[]
  councilorCount: number
}
const Card: React.FC<CardProps> = ({
  title,
  slug,
  city,
  billCount,
  speechCount,
  avatars,
  councilorCount,
}) => {
  return (
    <StyledLink href={`${InternalRoutes.CouncilTopic(city)}/${slug}`} passHref>
      <Container>
        <UpperSection>
          <Title text={title} />
          <Metrics>
            <Metric>
              <P2 text="相關發言" weight={P2.Weight.BOLD} />
              <MetricNumber>
                {speechCount > 999 ? '999+' : speechCount}
              </MetricNumber>
            </Metric>
            <Metric>
              <P2 text="相關議案" weight={P2.Weight.BOLD} />
              <MetricNumber>
                {billCount > 999 ? '999+' : billCount}
              </MetricNumber>
            </Metric>
          </Metrics>
        </UpperSection>
        <LowerSection>
          <AvatarContainer>
            {avatars.map((avatarUrl, index) => (
              <Avatar
                key={index}
                src={avatarUrl}
                alt={`councilor-avatar-${index}`}
                $ZIndex={avatars.length - index}
              />
            ))}
          </AvatarContainer>
          <CouncilorCount text={`共${councilorCount}人`} />
        </LowerSection>
      </Container>
    </StyledLink>
  )
}

export default Card
