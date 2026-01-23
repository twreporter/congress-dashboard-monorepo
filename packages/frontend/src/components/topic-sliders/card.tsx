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
  height: 268px;
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

const BillCount = styled.div`
  display: flex;
  flex-direction: row;
  color: ${colorGrayscale.gray900};
  gap: 12px;
  align-items: baseline;
`

const BillCountNumber = styled.div`
  font-family: 'Roboto Slab';
  font-size: 56px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
  ${mq.tabletAndBelow`
    font-size: 48px;
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
  avatars: string[]
  councilorCount: number
}
const Card: React.FC<CardProps> = ({
  title,
  slug,
  city,
  billCount,
  avatars,
  councilorCount,
}) => {
  return (
    <StyledLink href={`${InternalRoutes.CouncilTopic(city)}/${slug}`} passHref>
      <Container>
        <UpperSection>
          <Title text={title} />
          <BillCount>
            <BillCountNumber>
              {billCount > 999 ? '999+' : billCount}
            </BillCountNumber>
            <P2 text="筆相關發言" weight={P2.Weight.BOLD} />
          </BillCount>
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
