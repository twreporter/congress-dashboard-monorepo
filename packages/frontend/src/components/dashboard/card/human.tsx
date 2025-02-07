import React from 'react'
import styled from 'styled-components'
import {
  MEMBER_TYPE_LABEL,
  MemberType,
} from '@twreporter/congress-dashboard-shared/lib/cjs/constants/legislative-yuan-member'
// @twreporter
import {
  colorGrayscale,
  colorOpacity,
  colorBrand,
} from '@twreporter/core/lib/constants/color'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import { P2 } from '@twreporter/react-components/lib/text/paragraph'
import {
  DesktopAndAbove,
  TabletAndBelow,
} from '@twreporter/react-components/lib/rwd'

export enum CardSize {
  S,
  L,
}

const Box = styled.div<{ $selected: boolean; $size: CardSize }>`
  width: ${(props) => (props.$size === CardSize.S ? 327 : 452)}px;
  height: ${(props) => (props.$size === CardSize.S ? 154 : 196)}px;
  display: flex;
  border-radius: 4px;
  border: 1px solid ${colorOpacity['black_0.1']};
  cursor: pointer;

  ${(props) =>
    props.$selected
      ? `
    border: 1px solid ${colorBrand.dark};
    box-shadow: 0px 0px 16px 0px ${colorOpacity['black_0.2']};
  `
      : `
    &: hover {
      border: 1px solid ${colorOpacity['black_0.2']};
      box-shadow: 0px 0px 16px 0px ${colorOpacity['black_0.1']};
    }
  `}
`
const Title = styled.div`
  display: flex;
`
const Name = styled(H4)`
  color: ${colorGrayscale.gray800};
`
const Type = styled(P2)`
  color: ${colorGrayscale.gray800};
`
const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  gap: 14px;
`
const TagContainer = styled.div<{ $size: CardSize }>`
  display: flex;
  flex-direction: ${(props) => (props.$size === CardSize.S ? 'column' : 'row')};
  gap: ${(props) => (props.$size === CardSize.S ? 8 : 12)}px;
`
const TagItem = styled.div`
  display: flex;
  padding: 2px 8px;
  justify-content: center;
  align-items: center;
  border-radius: 40px;
  background: ${colorOpacity['black_0.05']};
  color: ${colorGrayscale.gray800};
  font-size: 14px;
  line-height: 150%;
`
const AvatarContainer = styled.div`
  position: relative;
`
const Avatar = styled.img<{ $size: CardSize }>`
  width: ${(props) => (props.$size === CardSize.S ? 119 : 152)}px;
  height: ${(props) => (props.$size === CardSize.S ? 154 : 196)}px;
`
const Party = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  position: absolute;
  left: 8px;
  bottom: 8px;
`

export type Tag = {
  name: string
  count: number
}

export type CardHumanProps = {
  name?: string
  tooltip?: string
  type?: typeof MEMBER_TYPE_LABEL
  tags?: Tag[]
  avatar?: string
  partyAvatar?: string
  size?: CardSize
  selected?: boolean
  onClick?: () => void
}
const CardHuman: React.FC<CardHumanProps> = ({
  name = '',
  //tooltip = '',
  type = MEMBER_TYPE_LABEL[MemberType.Constituency],
  tags = [],
  avatar = '',
  partyAvatar = '',
  size = CardSize.L,
  selected = false,
  onClick,
}: CardHumanProps) => {
  return (
    <Box $selected={selected} $size={size} onClick={onClick}>
      <AvatarContainer>
        <Avatar src={avatar} $size={size} />
        <Party src={partyAvatar} />
      </AvatarContainer>
      <DetailContainer>
        <div>
          <Title>
            <Name text={name} />
          </Title>
          <Type text={type} />
        </div>
        <TagContainer $size={size}>
          {tags.map(({ name, count }: Tag, index: number) => {
            return (
              <TagItem key={`legislator-${name}-tag-${index}`}>
                {`${name}(${count})`}
              </TagItem>
            )
          })}
        </TagContainer>
      </DetailContainer>
    </Box>
  )
}
export default CardHuman

const RwdBox = styled.div``
export const CardHumanRWD: React.FC<CardHumanProps> = (props) => (
  <RwdBox>
    <DesktopAndAbove>
      <CardHuman {...props} size={CardSize.L} />
    </DesktopAndAbove>
    <TabletAndBelow>
      <CardHuman {...props} size={CardSize.S} />
    </TabletAndBelow>
  </RwdBox>
)
