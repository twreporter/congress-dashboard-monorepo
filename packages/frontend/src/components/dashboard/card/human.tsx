import React from 'react'
import styled, { css } from 'styled-components'
// components
import Tooltip from './tooltip'
import { Triangle, Gap } from './skeleton'
// @twreporter
import {
  MEMBER_TYPE_LABEL,
  MemberType,
} from '@twreporter/congress-dashboard-shared/lib/cjs/constants/legislative-yuan-member'
import {
  colorGrayscale,
  colorOpacity,
  colorBrand,
} from '@twreporter/core/lib/constants/color'
import { H4 } from '@twreporter/react-components/lib/text/headline'
import { P2, P3 } from '@twreporter/react-components/lib/text/paragraph'
import {
  DesktopAndAbove,
  TabletAndBelow,
} from '@twreporter/react-components/lib/rwd'

export enum CardSize {
  S,
  L,
}

const boxCss = css<{ $size: CardSize }>`
  width: 100%;
  height: ${(props) => (props.$size === CardSize.S ? 154 : 196)}px;
  display: flex;
  border-radius: 4px;
  background-color: ${colorGrayscale.white};
`
const Box = styled.div<{ $selected: boolean; $size: CardSize }>`
  ${boxCss}
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
  align-items: center;
  gap: 4px;
`
const Name = styled(H4)`
  color: ${colorGrayscale.gray800};
`
const Type = styled(P2)`
  color: ${colorGrayscale.gray800};
`
const DetailContainer = styled.div<{ $isShowTag: boolean; $withGap: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) =>
    props.$isShowTag ? 'flex-start' : 'space-between'};
  padding: 16px;
  ${(props) => (props.$withGap ? 'gap: 14px;' : '')}
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
const Note = styled(P3)`
  color: ${colorGrayscale.gray600};
`
const AvatarContainer = styled.div`
  position: relative;
`
const avatarCss = css<{ $size: CardSize }>`
  width: ${(props) => (props.$size === CardSize.S ? 119 : 152)}px;
  height: ${(props) => (props.$size === CardSize.S ? 154 : 196)}px;
`
const Avatar = styled.img<{ $size: CardSize }>`
  ${avatarCss}
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
  note?: string
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
  tooltip = '',
  note = '',
  type = MEMBER_TYPE_LABEL[MemberType.Constituency],
  tags = [],
  avatar = '',
  partyAvatar = '',
  size = CardSize.L,
  selected = false,
  onClick,
}: CardHumanProps) => {
  const isShowTag = tags.length > 0
  return (
    <Box $selected={selected} $size={size} onClick={onClick}>
      <AvatarContainer>
        <Avatar src={avatar} $size={size} />
        <Party src={partyAvatar} />
      </AvatarContainer>
      <DetailContainer $isShowTag={isShowTag} $withGap={true}>
        <div>
          <Title>
            <Name text={name} />
            {tooltip ? <Tooltip tooltip={tooltip} /> : null}
          </Title>
          <Type text={type} />
        </div>
        {isShowTag ? (
          <TagContainer $size={size}>
            {tags.map(({ name, count }: Tag, index: number) => {
              return (
                <TagItem key={`legislator-${name}-tag-${index}`}>
                  {`${name}(${count})`}
                </TagItem>
              )
            })}
          </TagContainer>
        ) : (
          <Note text={note} />
        )}
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

// skeleton
const BoxSkeleton = styled.div<{ $size: CardSize }>`
  ${boxCss}
`
const AvatarSkeleton = styled(Triangle)<{ $size: CardSize }>`
  ${avatarCss}
`

type CardHumanSkeletonProps = {
  size?: CardSize
}
export const CardHumanSkeleton: React.FC<CardHumanSkeletonProps> = ({
  size = CardSize.L,
}) => {
  const isShowTag = false

  return (
    <BoxSkeleton $size={size}>
      <AvatarContainer>
        <AvatarSkeleton $size={size} />
      </AvatarContainer>
      <DetailContainer $isShowTag={isShowTag} $withGap={false}>
        {size === CardSize.L ? (
          <>
            <Triangle $width={'72px'} $height={'33px'} />
            <Gap $gap={4} />
            <Triangle $width={'136px'} $height={'21px'} />
            <Gap $gap={14} />
            <Triangle $width={'268px'} $height={'25px'} />
            <Gap $gap={8} />
            <Triangle $width={'268px'} $height={'25px'} />
            <Gap $gap={8} />
            <Triangle $width={'96px'} $height={'25px'} />
          </>
        ) : (
          <>
            <Triangle $width={'72px'} $height={'27px'} />
            <Gap $gap={4} />
            <Triangle $width={'120px'} $height={'21px'} />
            <Gap $gap={12} />
            <Triangle $width={'176px'} $height={'25px'} />
            <Gap $gap={8} />
            <Triangle $width={'96px'} $height={'25px'} />
          </>
        )}
      </DetailContainer>
    </BoxSkeleton>
  )
}

export const CardHumanSkeletonRWD: React.FC = () => (
  <RwdBox>
    <DesktopAndAbove>
      <CardHumanSkeleton size={CardSize.L} />
    </DesktopAndAbove>
    <TabletAndBelow>
      <CardHumanSkeleton size={CardSize.S} />
    </TabletAndBelow>
  </RwdBox>
)
