'use client'
import React, { FC } from 'react'
import styled, { css } from 'styled-components'
// @twreporter
import {
  colorGrayscale,
  colorOpacity,
} from '@twreporter/core/lib/constants/color'
import { P1, P2 } from '@twreporter/react-components/lib/text/paragraph'
import { H4 } from '@twreporter/react-components/lib/text/headline'
// components
import PartyTag from '@/components/dashboard/card/party-tag'
// enum
import { TagSize } from '@/components/dashboard/enum'

enum TYPE {
  LEGISLATOR = 'legislator',
  COUNCILOR = 'councilor',
}
enum SIZE {
  S = 's',
  L = 'l',
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  border-radius: 4px;
  border: 1px solid ${colorOpacity['black_0.1']};
  background: ${colorGrayscale.white};
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
  }
`
const AvatarContainer = styled.div`
  position: relative;
`
const avatarCss = css<{ $size: SIZE }>`
  width: ${(props) => (props.$size === SIZE.S ? 128 : 132)}px;
  height: 100%;
`
const Avatar = styled.img<{ $size: SIZE; $cardType?: TYPE }>`
  ${avatarCss}
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border-right: 1px solid ${colorOpacity['black_0.05']};
  ${(props) =>
    props.$cardType === TYPE.COUNCILOR &&
    css`
      object-fit: cover;
    `}
`
const Mask = styled.div<{ $size: SIZE }>`
  opacity: 0.1;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000 100%);
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: ${(props) => (props.$size === SIZE.L ? 64 : 48)}px;
`

const Party = styled(PartyTag)`
  width: 32px;
  height: 32px;
  position: absolute;
  left: 8px;
  bottom: 8px;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 6px;
`

const TitleAndName = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Title = styled(P2)`
  color: ${colorGrayscale.gray900};
`

const Name = styled(H4)`
  color: ${colorGrayscale.gray900};
`

const Description = styled(P1)`
  color: ${colorGrayscale.gray800};
  height: 48px;
  align-items: flex-start !important;
`

const CountAndDate = styled(P2)`
  color: ${colorGrayscale.gray800};
`

type FollowingPeopleCardProps = {
  type: TYPE
  size: SIZE
  avatar: string
  party: string
  name: string
  description: string
  count: number
  latestDate: string
  destrict?: string
}
export const FollowingPeopleCard: FC<FollowingPeopleCardProps> & {
  Type: typeof TYPE
  Size: typeof SIZE
} = ({
  type = TYPE.LEGISLATOR,
  size = SIZE.L,
  avatar,
  party,
  name,
  description,
  count,
  latestDate,
  destrict = '',
}) => {
  const titleText = type === TYPE.LEGISLATOR ? '立委' : `議員 | ${destrict}議會`
  return (
    <Container>
      <AvatarContainer>
        <Avatar src={avatar} $size={size} $cardType={type} />
        <Mask $size={size} />
        <Party avatar={party} size={TagSize.L} />
      </AvatarContainer>
      <ContentContainer>
        <TitleAndName>
          <Title text={titleText} weight={P2.Weight.BOLD} />
          <Name text={name} />
        </TitleAndName>
        <Description text={description} />
        <CountAndDate text={`最新${count}筆發言於 ${latestDate}`} />
      </ContentContainer>
    </Container>
  )
}
FollowingPeopleCard.Type = TYPE
FollowingPeopleCard.Size = SIZE
